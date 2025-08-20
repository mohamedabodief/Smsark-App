import {
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
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
import User from './User';

const PACKAGE_INFO = {
  1: { name: 'باقة الأساس', price: 100, duration: 7 },
  2: { name: 'باقة النخبة', price: 150, duration: 14 },
  3: { name: 'باقة التميز', price: 200, duration: 21 },
};

class FinancingAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.images = data.images || [];
    this.phone = data.phone || '';
    this.start_limit = data.start_limit ? Number(data.start_limit) : null;
    this.end_limit = data.end_limit ? Number(data.end_limit) : null;
    this.org_name = data.org_name || '';
    this.type_of_user = data.type_of_user || '';
    this.userId = data.userId || '';
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.interest_rate_upto_5 = data.interest_rate_upto_5 ? Number(data.interest_rate_upto_5) : null;
    this.interest_rate_upto_10 = data.interest_rate_upto_10 ? Number(data.interest_rate_upto_10) : null;
    this.interest_rate_above_10 = data.interest_rate_above_10 ? Number(data.interest_rate_above_10) : null;
    this.receipt_image = data.receipt_image || null;
    this.reviewStatus = data.reviewStatus || 'pending';
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.status = data.status || 'تحت العرض';
    this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
  }

  get id() {
    return this.#id;
  }

  async save(imagesFiles = [], receiptFile = null) {
   

    const colRef = collection(db, 'FinancingAdvertisements');
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

    // رفع الإيصال
    if (receiptFile) {
      const receiptUrl = await this.#uploadReceipt(receiptFile);
      this.receipt_image = receiptUrl;
      await updateDoc(docRef, { receipt_image: receiptUrl });
    }

    return this.#id;
  }

  async update(updates = {}, newImagesFiles = null, newReceiptFile = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);

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

    if (newImagesFiles?.length > 0) {
      await this.#deleteAllImages();
      if (newImagesFiles[0] instanceof File) {
        const newUrls = await this.#uploadImages(newImagesFiles);
        updates.images = newUrls;
        this.images = newUrls;
      } else if (typeof newImagesFiles[0] === 'string') {
        updates.images = newImagesFiles;
        this.images = newImagesFiles;
      }
    } else if (typeof updates.images === 'undefined') {
      updates.images = this.images;
    }

    if (newReceiptFile) {
      const receiptUrl = await this.#uploadReceipt(newReceiptFile);
      updates.receipt_image = receiptUrl;
      this.receipt_image = receiptUrl;
    }

    if (typeof updates.userId === 'undefined' || !updates.userId) {
      updates.userId = this.userId;
    }

    if (
      updates.status &&
      !['تحت العرض', 'تحت التفاوض', 'منتهي'].includes(updates.status)
    ) {
      throw new Error('❌ قيمة حالة الإعلان غير صالحة');
    }

    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'FinancingAdvertisements', this.#id));
  }

  async approve() {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'approved',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    };
    await this.update(updates);
  }

  async reject(reason = '') {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'rejected',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason,
    };
    await this.update(updates);
  }

  async returnToPending() {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'pending',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    };
    await this.update(updates);
  }

  async adsActivation(days) {
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  async removeAds() {
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  static async getById(id) {
    const snap = await getDoc(doc(db, 'FinancingAdvertisements', id));
    return snap.exists() ? new FinancingAdvertisement({ ...snap.data(), id: snap.id }) : null;
  }

  static async getAll() {
    const col = collection(db, 'FinancingAdvertisements');
    const snap = await getDocs(col);
    return snap.docs.map((d) => new FinancingAdvertisement({ ...d.data(), id: d.id }));
  }

  static async getByReviewStatus(status) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('reviewStatus', '==', status)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new FinancingAdvertisement({ ...d.data(), id: d.id }));
  }

  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('reviewStatus', '==', status)
    );
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map(
        (docSnap) => new FinancingAdvertisement({ ...docSnap.data(), id: docSnap.id })
      );
      callback(ads);
    });
  }

  static async getByUserId(userId) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new FinancingAdvertisement({ ...d.data(), id: d.id }));
  }

  static subscribeActiveAds(callback) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('ads', '==', true)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map((d) => new FinancingAdvertisement({ ...d.data(), id: d.id }));
      callback(ads);
    });
  }

  static subscribeAllAds(callback) {
    const q = collection(db, 'FinancingAdvertisements');
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map(
        (d) => new FinancingAdvertisement({ ...d.data(), id: d.id })
      );
      callback(ads);
    });
  }

 async #uploadImages(files = []) {
  const storage = getStorage();
  const urls = [];
  const limited = files.slice(0, 4);
  for (let i = 0; i < limited.length; i++) {
    const refPath = ref(
      storage,
      `financing_images/${this.userId}/image_${i + 1}.jpg`
    );
    try {
      await uploadBytes(refPath, limited[i]);
      const url = await getDownloadURL(refPath);
      urls.push(url);
    } catch (error) {
      throw error;
    }
  }
  return urls;
}
  async #uploadReceipt(file) {
    const storage = getStorage();
    const refPath = ref(storage, `financing_images/${this.userId}/receipt.jpg`);
    await uploadBytes(refPath, file);
    const url = await getDownloadURL(refPath);
    return url;
  }

  async #deleteAllImages() {
    const storage = getStorage();
    const dirRef = ref(storage, `financing_images/${this.userId}`);
    try {
      const list = await listAll(dirRef);
      await Promise.all(list.items.map((ref) => deleteObject(ref)));
    } catch (error) {
    }
  }

  async #deleteReceipt() {
    const storage = getStorage();
    const receiptRef = ref(storage, `financing_images/${this.userId}/receipt.jpg`);
    try {
      await deleteObject(receiptRef);
    } catch (error) {
    }
  }

  #getAdData() {
    let adPackageName = null, adPackagePrice = null, adPackageDuration = null;
    const pkgKey = String(this.adPackage);
    if (pkgKey && PACKAGE_INFO[pkgKey]) {
      adPackageName = PACKAGE_INFO[pkgKey].name;
      adPackagePrice = PACKAGE_INFO[pkgKey].price;
      adPackageDuration = PACKAGE_INFO[pkgKey].duration;
    }
    return {
      title: this.title,
      description: this.description,
      images: this.images,
      phone: this.phone,
      start_limit: this.start_limit,
      end_limit: this.end_limit,
      org_name: this.org_name,
      type_of_user: this.type_of_user,
      userId: this.userId,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
      interest_rate_upto_5: this.interest_rate_upto_5,
      interest_rate_upto_10: this.interest_rate_upto_10,
      interest_rate_above_10: this.interest_rate_above_10,
      receipt_image: this.receipt_image,
      reviewStatus: this.reviewStatus,
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
      status: this.status,
      adPackage: this.adPackage,
      adPackageName,
      adPackagePrice,
      adPackageDuration,
    };
  }
}

export default FinancingAdvertisement;