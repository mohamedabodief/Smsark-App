import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

export default class ClientAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.price = data.price ? parseFloat(data.price) : 0;
    this.images = Array.isArray(data.images) ? data.images : [];
    this.location = data.location || '';
    this.governorate = data.governorate || '';
    this.city = data.city || '';
    this.space = data.space ? parseFloat(data.space) : 0;
    this.userId = data.userId || data.developer_id || '';
    this.created_at = data.created_at || serverTimestamp();
    this.expiry_days = data.expiry_days || 30;
    this.is_active = data.is_active ?? true;
    this.status = data.status || 'pending';
    this.rejection_reason = data.rejection_reason || '';
    this.admin_note = data.admin_note || '';
    this.type = data.type || '';
    this.ad_type = data.ad_type || '';
    this.reviewStatus = data.reviewStatus || 'pending';
    this.phone = data.phone || '';
    this.username = data.username || '';
    this.address = data.address || '';
    this.building_date = data.building_date || '';
    this.adPackage = data.adPackage || ''; // حقل الباقة الجديد
    this.receiptUrl = data.receiptUrl || ''; // رابط صورة الإيصال
  }

  get id() {
    return this.#id;
  }

  async save(imageFiles = [], receiptFile) {
    try {
      // التحقق من الحقول الإلزامية
      const requiredFields = {
        title: this.title,
        description: this.description,
        price: this.price,
        location: this.location,
        governorate: this.governorate,
        city: this.city,
        space: this.space,
        userId: this.userId,
        type: this.type,
        ad_type: this.ad_type,
        phone: this.phone,
        username: this.username,
        address: this.address,
        building_date: this.building_date,
        adPackage: this.adPackage,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          throw new Error(`حقل ${field} مطلوب`);
        }
      }

      // التحقق من قيمة adPackage
      const validPackages = ['1', '2', '3'];
      if (!validPackages.includes(this.adPackage)) {
        throw new Error('الباقة غير صالحة. اختر: الأساس (1)، النخبة (2)، التميز (3)');
      }

      // التحقق من وجود صورة إيصال
      if (!receiptFile) {
        throw new Error('صورة الإيصال مطلوبة');
      }

      const docRef = doc(db, 'ClientAdvertisements', this.#id || doc(collection(db, 'ClientAdvertisements')).id);
      this.#id = docRef.id;
      await setDoc(docRef, this.#getAdData());

      // رفع الصور إلى Firebase Storage
      if (imageFiles.length > 0) {
        const imageUrls = await this.#uploadImages(imageFiles);
        this.images = imageUrls;
        await updateDoc(docRef, { images: imageUrls });
      }

      // رفع صورة الإيصال إلى Firebase Storage
      const receiptStorageRef = ref(storage, `client_ads/${this.userId}/${this.#id}/receipt.jpg`);
      await uploadBytes(receiptStorageRef, receiptFile);
      const receiptUrl = await getDownloadURL(receiptStorageRef);
      this.receiptUrl = receiptUrl;
      await updateDoc(docRef, { receiptUrl });

      return this.#id;
    } catch (error) {
      console.error('Error saving advertisement:', error);
      throw error;
    }
  }

  async update(updates = {}, newImageFiles = [], newReceiptFile) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'ClientAdvertisements', this.#id);

    // تحديث الحقول
    const updatedData = { ...this.#getAdData(), ...updates };

    // التحقق من adPackage إذا تم تحديثه
    if (updates.adPackage) {
      const validPackages = ['1', '2', '3'];
      if (!validPackages.includes(updates.adPackage)) {
        throw new Error('الباقة غير صالحة. اختر: الأساس (1)، النخبة (2)، التميز (3)');
      }
    }

    // تحديث الصور إذا تم تقديم صور جديدة
    if (newImageFiles.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImageFiles);
      updatedData.images = newUrls;
      this.images = newUrls;
    } else if (typeof updates.images === 'undefined') {
      updatedData.images = this.images;
    }

    // تحديث صورة الإيصال إذا تم تقديم صورة جديدة
    if (newReceiptFile) {
      await this.#deleteReceipt();
      const receiptStorageRef = ref(storage, `client_ads/${this.userId}/${this.#id}/receipt.jpg`);
      await uploadBytes(receiptStorageRef, newReceiptFile);
      const receiptUrl = await getDownloadURL(receiptStorageRef);
      updatedData.receiptUrl = receiptUrl;
      this.receiptUrl = receiptUrl;
    }

    await updateDoc(docRef, updatedData);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'ClientAdvertisements', this.#id));
  }

  async approveAd(admin_note = '') {
    await this.update({ status: 'approved', admin_note, reviewStatus: 'approved' });
  }

  async rejectAd(rejection_reason) {
    await this.update({ status: 'rejected', rejection_reason, reviewStatus: 'rejected' });
  }

  async returnToPending() {
    await this.update({ status: 'pending', rejection_reason: '', admin_note: '', reviewStatus: 'pending' });
  }

  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, 'ClientAdvertisements', data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new ClientAdvertisement(data);
  }

  static async getById(id) {
    try {
      const docRef = doc(db, 'ClientAdvertisements', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = await ClientAdvertisement.#handleExpiry({ id: snapshot.id, ...snapshot.data() });
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error getting advertisement by ID:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const q = query(collection(db, 'ClientAdvertisements'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => new ClientAdvertisement({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all advertisements:', error);
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const q = query(collection(db, 'ClientAdvertisements'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => new ClientAdvertisement({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting advertisements by userId:', error);
      throw error;
    }
  }

  static subscribeAll(callback) {
    const q = query(collection(db, 'ClientAdvertisements'));
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new ClientAdvertisement({ id: doc.id, ...doc.data() }));
      callback(ads);
    }, (error) => {
      console.error('Error subscribing to advertisements:', error);
    });
  }

  async #uploadImages(files = []) {
    const urls = [];
    const limited = files.slice(0, 4);
    for (let i = 0; i < limited.length; i++) {
      const file = limited[i];
      const storageRef = ref(storage, `client_ads/${this.userId}/${this.#id}/image_${i + 1}.jpg`);
      if (typeof file === 'string') {
        urls.push(file);
      } else {
        await uploadBytes(storageRef, file);
        urls.push(await getDownloadURL(storageRef));
      }
    }
    return urls;
  }

  async #deleteAllImages() {
    const dirRef = ref(storage, `client_ads/${this.userId}/${this.#id}`);
    try {
      const list = await listAll(dirRef);
      for (const fileRef of list.items) {
        if (!fileRef.name.includes('receipt.jpg')) {
          await deleteObject(fileRef);
        }
      }
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  }

  async #deleteReceipt() {
    if (this.receiptUrl) {
      const receiptRef = ref(storage, `client_ads/${this.userId}/${this.#id}/receipt.jpg`);
      try {
        await deleteObject(receiptRef);
      } catch (error) {
        console.error('Error deleting receipt:', error);
      }
    }
  }

  #getAdData() {
    return {
      id: this.#id,
      title: this.title,
      description: this.description,
      price: this.price,
      images: this.images,
      location: this.location,
      governorate: this.governorate,
      city: this.city,
      space: this.space,
      userId: this.userId,
      created_at: this.created_at,
      expiry_days: this.expiry_days,
      is_active: this.is_active,
      status: this.status,
      rejection_reason: this.rejection_reason,
      admin_note: this.admin_note,
      type: this.type,
      ad_type: this.ad_type,
      reviewStatus: this.reviewStatus,
      phone: this.phone,
      username: this.username,
      address: this.address,
      building_date: this.building_date,
      adPackage: this.adPackage,
      receiptUrl: this.receiptUrl,
    };
  }
}