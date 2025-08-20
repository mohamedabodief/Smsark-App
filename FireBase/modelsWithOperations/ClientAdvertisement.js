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
    this.adPackage = data.adPackage || '';
    this.receiptUrl = data.receiptUrl || '';
  }

  get id() {
    return this.#id;
  }

  async save(imageFiles = [], receiptFile) {
    try {
      console.log('بدء حفظ الإعلان مع معرف:', this.#id || 'سيتم إنشاء معرف جديد');

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

      // إنشاء معرف جديد إذا لم يكن موجودًا
      const docRef = doc(db, 'ClientAdvertisements', this.#id || doc(collection(db, 'ClientAdvertisements')).id);
      this.#id = docRef.id;
      console.log('معرف الإعلان:', this.#id);

      // حفظ البيانات الأولية في Firestore
      await setDoc(docRef, this.#getAdData());
      console.log('تم حفظ البيانات الأولية في Firestore:', this.#getAdData());

      // رفع الصور إلى Firebase Storage
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await this.#uploadImages(imageFiles);
        this.images = imageUrls;
        await updateDoc(docRef, { images: imageUrls });
        console.log('تم تحديث الصور في Firestore:', imageUrls);
      }

      // رفع صورة الإيصال إلى Firebase Storage
      const receiptStorageRef = ref(storage, `client_ads/${this.#id}/receipt.jpg`);
      console.log('رفع صورة الإيصال إلى:', `client_ads/${this.#id}/receipt.jpg`);
      await uploadBytes(receiptStorageRef, receiptFile);
      const receiptUrl = await getDownloadURL(receiptStorageRef);
      this.receiptUrl = receiptUrl;
      await updateDoc(docRef, { receiptUrl });
      console.log('تم تحديث رابط صورة الإيصال في Firestore:', receiptUrl);

      return this.#id;
    } catch (error) {
      console.error('خطأ في حفظ الإعلان:', error);
      throw error;
    }
  }

  async update(updates = {}, newImageFiles = [], newReceiptFile) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'ClientAdvertisements', this.#id);
    console.log('بدء تحديث الإعلان:', this.#id);

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
      console.log('تم تحديث الصور:', newUrls);
    } else if (typeof updates.images === 'undefined') {
      updatedData.images = this.images;
    }

    // تحديث صورة الإيصال إذا تم تقديم صورة جديدة
    if (newReceiptFile) {
      await this.#deleteReceipt();
      const receiptStorageRef = ref(storage, `client_ads/${this.#id}/receipt.jpg`);
      console.log('رفع صورة الإيصال الجديدة إلى:', `client_ads/${this.#id}/receipt.jpg`);
      await uploadBytes(receiptStorageRef, newReceiptFile);
      const receiptUrl = await getDownloadURL(receiptStorageRef);
      updatedData.receiptUrl = receiptUrl;
      this.receiptUrl = receiptUrl;
      console.log('تم تحديث رابط صورة الإيصال:', receiptUrl);
    }

    await updateDoc(docRef, updatedData);
    console.log('تم تحديث الإعلان في Firestore:', updatedData);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID');
    console.log('حذف الإعلان:', this.#id);
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'ClientAdvertisements', this.#id));
    console.log('تم حذف الإعلان من Firestore');
  }

  async approveAd(admin_note = '') {
    console.log('تفعيل الإعلان:', this.#id);
    await this.update({ status: 'approved', admin_note, reviewStatus: 'approved' });
  }

  async rejectAd(rejection_reason) {
    console.log('رفض الإعلان:', this.#id);
    await this.update({ status: 'rejected', rejection_reason, reviewStatus: 'rejected' });
  }

  async returnToPending() {
    console.log('إعادة الإعلان إلى الانتظار:', this.#id);
    await this.update({ status: 'pending', rejection_reason: '', admin_note: '', reviewStatus: 'pending' });
  }

  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, 'ClientAdvertisements', data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
      console.log('تم تحديث حالة انتهاء الصلاحية للإعلان:', data.id);
    }
    return new ClientAdvertisement(data);
  }

  static async getById(id) {
    try {
      console.log('جلب الإعلان بمعرف:', id);
      const docRef = doc(db, 'ClientAdvertisements', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = await ClientAdvertisement.#handleExpiry({ id: snapshot.id, ...snapshot.data() });
        return data;
      }
      console.warn('الإعلان غير موجود:', id);
      return null;
    } catch (error) {
      console.error('خطأ في جلب الإعلان بمعرف:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      console.log('جلب كل الإعلانات');
      const q = query(collection(db, 'ClientAdvertisements'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => new ClientAdvertisement({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('خطأ في جلب كل الإعلانات:', error);
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      console.log('جلب الإعلانات للمستخدم:', userId);
      const q = query(collection(db, 'ClientAdvertisements'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => new ClientAdvertisement({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('خطأ في جلب الإعلانات للمستخدم:', error);
      throw error;
    }
  }

  static subscribeAll(callback) {
    console.log('الاشتراك في تحديثات الإعلانات');
    const q = query(collection(db, 'ClientAdvertisements'));
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new ClientAdvertisement({ id: doc.id, ...doc.data() }));
      callback(ads);
    }, (error) => {
      console.error('خطأ في الاشتراك في الإعلانات:', error);
    });
  }

  async #uploadImages(files = []) {
    const urls = [];
    const limited = files.slice(0, 4);
    console.log('بدء رفع الصور:', limited.length);
    for (let i = 0; i < limited.length; i++) {
      const file = limited[i];
      const storageRef = ref(storage, `client_ads/${this.#id}/image_${i + 1}.jpg`);
      if (typeof file === 'string') {
        console.log('استخدام رابط الصورة:', file);
        urls.push(file);
      } else {
        console.log('رفع الصورة إلى:', `client_ads/${this.#id}/image_${i + 1}.jpg`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
        console.log('تم رفع الصورة:', url);
      }
    }
    return urls;
  }

  async #deleteAllImages() {
    const dirRef = ref(storage, `client_ads/${this.#id}`);
    try {
      console.log('حذف جميع الصور من:', `client_ads/${this.#id}`);
      const list = await listAll(dirRef);
      for (const fileRef of list.items) {
        if (!fileRef.name.includes('receipt.jpg')) {
          await deleteObject(fileRef);
          console.log('تم حذف الصورة:', fileRef.name);
        }
      }
    } catch (error) {
      console.error('خطأ في حذف الصور:', error);
    }
  }

  async #deleteReceipt() {
    if (this.receiptUrl) {
      const receiptRef = ref(storage, `client_ads/${this.#id}/receipt.jpg`);
      try {
        console.log('حذف صورة الإيصال من:', `client_ads/${this.#id}/receipt.jpg`);
        await deleteObject(receiptRef);
      } catch (error) {
        console.error('خطأ في حذف صورة الإيصال:', error);
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