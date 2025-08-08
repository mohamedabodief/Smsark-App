import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { db, auth } from '../firebaseConfig';

const PACKAGE_INFO = {
  1: { name: 'باقة الأساس', price: 100, duration: 7 },
  2: { name: 'باقة النخبة', price: 150, duration: 14 },
  3: { name: 'باقة التميز', price: 200, duration: 21 },
};

class RealEstateDeveloperAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null; // الـ id اختياري، مش هيرمي خطأ لو مش موجود
    this.developer_name = data.developer_name || '';
    this.description = data.description || '';
    this.project_types = data.project_types || '';
    this.images = data.images || [];
    this.phone = data.phone || '';
    this.location = data.location || '';
    this.price_start_from = data.price_start_from || 0;
    this.price_end_to = data.price_end_to || 0;
    this.userId = data.userId || '';
    this.type_of_user = data.type_of_user || '';
    this.rooms = data.rooms || null;
    this.bathrooms = data.bathrooms || null;
    this.floor = data.floor || null;
    this.furnished = data.furnished || false;
    this.status = data.status || 'تحت العرض';
    this.paymentMethod = data.paymentMethod || null;
    this.negotiable = data.negotiable || false;
    this.deliveryTerms = data.deliveryTerms || null;
    this.features = data.features || [];
    this.area = data.area || null;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.receipt_image = data.receipt_image || null;
    this.reviewStatus = data.reviewStatus || 'pending';
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
  }

  // ✅ getter للـ ID
  get id() {
    return this.#id;
  }

  // ✅ إنشاء إعلان جديد + رفع الصور + إيصال الدفع
  async save(imagesFiles = [], receiptFile = null) {

    
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    if (imagesFiles.length > 0 && imagesFiles[0] instanceof File) {
      const imageUrls = await this.#uploadImages(imagesFiles);
      this.images = imageUrls;
      await updateDoc(docRef, { images: imageUrls });
    } else if (imagesFiles.length > 0 && typeof imagesFiles[0] === 'string') {
      this.images = imagesFiles;
      await updateDoc(docRef, { images: imagesFiles });
    }

    // رفع الريسيت
    if (receiptFile) {
      const receiptUrl = await this.#uploadReceipt(receiptFile);
      this.receipt_image = receiptUrl;
      await updateDoc(docRef, { receipt_image: receiptUrl });
    }

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان + صور جديدة + إيصال جديد
  async update(updates = {}, newImagesFiles = null, newReceiptFile = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);

    // تحديث معلومات الباقة إذا تم تغييرها
    if (typeof updates.adPackage !== 'undefined' && updates.adPackage !== null) {
      const pkgKey = String(updates.adPackage);
      if (PACKAGE_INFO[pkgKey]) {
        updates.adPackageName = PACKAGE_INFO[pkgKey].name;
        updates.adPackagePrice = PACKAGE_INFO[pkgKey].price;
        updates.adPackageDuration = PACKAGE_INFO[pkgKey].duration;
      } else {
        updates.adPackageName = null;
        updates.adPackagePrice = null;
        updates.adPackageDuration = null;
      }
    }

    // الصور
    if (newImagesFiles?.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImagesFiles);
      updates.images = newUrls;
      this.images = newUrls;
    } else if (typeof updates.images === 'undefined') {
      updates.images = this.images;
    }

    // إيصال الدفع
    if (newReceiptFile) {
      const receiptUrl = await this.#uploadReceipt(newReceiptFile);
      updates.receipt_image = receiptUrl;
      this.receipt_image = receiptUrl;
    }

    // تحقق من صحة الحالة
    if (
      updates.status &&
      !['جاهز', 'قيد الإنشاء'].includes(updates.status)
    ) {
      throw new Error('❌ الحالة غير صالحة. اختر إما "جاهز" أو "قيد الإنشاء"');
    }

    // لا تغير userId إذا لم يتم تمريره أو كان فارغًا
    if (typeof updates.userId === 'undefined' || !updates.userId) {
      updates.userId = this.userId;
    }

    await updateDoc(docRef, updates);
  }

  // ✅ حذف الإعلان بالكامل (من قاعدة البيانات + الصور)
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'RealEstateDeveloperAdvertisements', this.#id));
  }

  // ✅ الموافقة على الإعلان
  async approve() {
    const admin = { uid: 'admin', adm_name: 'Admin' };
    await this.update({
      reviewStatus: 'approved',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });
  }

  // ❌ رفض الإعلان
  async reject(reason = '') {
    const admin = { uid: 'admin', adm_name: 'Admin' };
    await this.update({
      reviewStatus: 'rejected',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason,
    });
  }

  // 🔁 إعادة الإعلان لحالة "pending"
  async returnToPending() {
    const admin = { uid: 'admin', adm_name: 'Admin' };
    await this.update({
      reviewStatus: 'pending',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });
  }

  // ⏳ تفعيل الإعلان لفترة معينة
  async adsActivation(days) {
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  // ❌ إلغاء التفعيل
  async removeAds() {
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  // 📥 جلب إعلان واحد بالـ ID
  static async getById(id) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return new RealEstateDeveloperAdvertisement({
        ...data,
        id: snap.id
      });
    }
    return null;
  }

  // 📥 جلب كل الإعلانات
  static async getAll() {
    const snap = await getDocs(
      collection(db, 'RealEstateDeveloperAdvertisements')
    );
    return snap.docs.map((d) => new RealEstateDeveloperAdvertisement({
      ...d.data(),
      id: d.id
    }));
  }

  // 📥 جلب إعلانات حسب حالة المراجعة
  static async getByReviewStatus(status) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('reviewStatus', '==', status)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new RealEstateDeveloperAdvertisement({
      ...d.data(),
      id: d.id
    }));
  }

  // 📥 جلب إعلانات مستخدم معين
  static async getByUserId(userId) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new RealEstateDeveloperAdvertisement({
      ...d.data(),
      id: d.id
    }));
  }

  // ✅ الاشتراك اللحظي في الإعلانات حسب حالة المراجعة
  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('reviewStatus', '==', status)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map(
        (d) => new RealEstateDeveloperAdvertisement({
          ...d.data(),
          id: d.id
        })
      );
      callback(ads);
    });
  }

  // 🔁 استماع لحظي للإعلانات المفعلة
  static subscribeActiveAds(callback) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('ads', '==', true)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map(
        (d) => new RealEstateDeveloperAdvertisement({
          ...d.data(),
          id: d.id
        })
      );
      callback(ads);
    });
  }

  // 🔁 استماع لحظي لجميع الإعلانات
  static subscribeAllAds(callback) {
    const q = collection(db, 'RealEstateDeveloperAdvertisements');
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map(
        (d) => new RealEstateDeveloperAdvertisement({
          ...d.data(),
          id: d.id
        })
      );
      callback(ads);
    });
  }

  // 🔐 رفع صور الإعلان
  async #uploadImages(files = []) {
    const storage = getStorage();
    const urls = [];
    const limited = files.slice(0, 4);
    for (let i = 0; i < limited.length; i++) {
      const refPath = ref(
        storage,
        `property_images/${this.userId}/image_${i + 1}.jpg`
      );
      await uploadBytes(refPath, limited[i]);
      urls.push(await getDownloadURL(refPath));
    }
    return urls;
  }

  // 🔐 رفع إيصال الدفع
  async #uploadReceipt(file) {
    const storage = getStorage();
    const refPath = ref(storage, `property_images/${this.userId}/receipt.jpg`);
    await uploadBytes(refPath, file);
    return await getDownloadURL(refPath);
  }

  // 🗑️ حذف كل الصور
  async #deleteAllImages() {
    const dirRef = ref(getStorage(), `property_images/${this.userId}`);
    try {
      const list = await listAll(dirRef);
      for (const fileRef of list.items) await deleteObject(fileRef);
    } catch (_) {}
  }

  // 🗑️ حذف إيصال الدفع
  async #deleteReceipt() {
    const fileRef = ref(getStorage(), `property_images/${this.userId}/receipt.jpg`);
    try {
      await deleteObject(fileRef);
    } catch (_) {}
  }

  // 📤 تجهيز بيانات الإعلان للتخزين
  #getAdData() {
    let adPackageName = null, adPackagePrice = null, adPackageDuration = null;
    const pkgKey = String(this.adPackage);
    if (pkgKey && PACKAGE_INFO[pkgKey]) {
      adPackageName = PACKAGE_INFO[pkgKey].name;
      adPackagePrice = PACKAGE_INFO[pkgKey].price;
      adPackageDuration = PACKAGE_INFO[pkgKey].duration;
    }

    const data = {
      developer_name: this.developer_name,
      description: this.description,
      project_types: this.project_types,
      images: this.images,
      phone: this.phone,
      location: this.location,
      price_start_from: this.price_start_from,
      price_end_to: this.price_end_to,
      userId: this.userId,
      type_of_user: this.type_of_user,
      rooms: this.rooms,
      bathrooms: this.bathrooms,
      floor: this.floor,
      furnished: this.furnished,
      status: this.status,
      paymentMethod: this.paymentMethod,
      negotiable: this.negotiable,
      deliveryTerms: this.deliveryTerms,
      features: this.features,
      area: this.area,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
      receipt_image: this.receipt_image,
      reviewStatus: this.reviewStatus,
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
      adPackage: this.adPackage,
      adPackageName,
      adPackagePrice,
      adPackageDuration,
    };
    
    // إضافة الـ id إذا كان موجودًا
    if (this.#id) {
      data.id = this.#id;
    }
    
    return data;
  }
}

export default RealEstateDeveloperAdvertisement;