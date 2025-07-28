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
import User from './User';

// أضف هذا الكائن الثابت في أعلى الملف بعد الاستيرادات
const PACKAGE_INFO = {
  1: { name: 'باقة الأساس', price: 100, duration: 7 },
  2: { name: 'باقة النخبة', price: 150, duration: 14 },
  3: { name: 'باقة التميز', price: 200, duration: 21 },
};

class RealEstateDeveloperAdvertisement {
  #id = null;

  constructor(data) {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل إنشاء عقار جديد");
    // }
    
    this.#id = data.id || null;
    if (!this.#id) {
      console.error('RealEstateDeveloperAdvertisement: id is missing in constructor data:', data);
    }
    this.developer_name = data.developer_name;
    this.description = data.description;
    this.project_types = data.project_types;
    this.images = data.images || [];
    this.phone = data.phone;
    this.location = data.location;
    this.price_start_from = data.price_start_from;
    this.price_end_to = data.price_end_to;
    this.userId = data.userId;
    this.type_of_user = data.type_of_user;
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل الوصول لمعرف العقار");
    // }
    
    return this.#id;
  }

  // ✅ إنشاء إعلان جديد + رفع الصور + إيصال الدفع + إرسال إشعار للمشرف
  async save(imagesFiles = [], receiptFile = null) {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل إضافة عقار");
    // }
    
    console.log('Saving advertisement for user:', this.userId || 'unknown');
    
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    // إذا كانت الصور ملفات، قم برفعها
    if (imagesFiles.length > 0 && imagesFiles[0] instanceof File) {
      const imageUrls = await this.#uploadImages(imagesFiles);
      this.images = imageUrls;
      await updateDoc(docRef, { images: imageUrls });
    }
    // إذا كانت الصور روابط بالفعل، لا نحتاج لرفعها

    // رفع الريسيت بعد تعيين this.#id
    if (receiptFile) {
      const receiptUrl = await this.#uploadReceipt(receiptFile);
      this.receipt_image = receiptUrl;
      await updateDoc(docRef, { receipt_image: receiptUrl });
    }

    // TODO: إضافة نظام الإشعارات لاحقاً
    // const admins = await User.getAllUsersByType('admin');
    // await Promise.all(
    //   admins.map((admin) =>
    //     new Notification({
    //       receiver_id: admin.uid,
    //       title: 'إعلان مطور جديد بانتظار المراجعة',
    //       body: `المطور: ${this.developer_name}`,
    //       type: 'system',
    //       link: `/admin/developer-ads/${this.#id}`,
    //     }).send()
    //   )
    // );

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان + صور جديدة + إيصال جديد
  async update(updates = {}, newImagesFiles = null, newReceiptFile = null) {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل تعديل العقار");
    // }
    
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
      // إذا لم يتم رفع صور جديدة ولم يتم تمرير images في التحديثات، احتفظ بالصور القديمة
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل حذف العقار");
    // }
    
    if (!this.#id) throw new Error('الإعلان بدون ID');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'RealEstateDeveloperAdvertisements', this.#id));
  }

  // ✅ الموافقة على الإعلان
  async approve() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل الموافقة على العقار");
    // }
    
    // const admin = await User.getByUid(currentUser.uid);
    const admin = { uid: 'admin', adm_name: 'Admin' }; // استخدام بيانات افتراضية
    await this.update({
      reviewStatus: 'approved',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });

    // TODO: إضافة نظام الإشعارات لاحقاً
    // await new Notification({
    //   receiver_id: this.userId,
    //   title: '✅ تمت الموافقة على إعلانك العقاري',
    //   body: `تمت الموافقة على إعلانك "${this.developer_name}" وسيظهر في الواجهة.`,
    //   type: 'system',
    //   link: `/client/developer-ads/${this.#id}`,
    // }).send();
  }

  // ❌ رفض الإعلان
  async reject(reason = '') {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل رفض العقار");
    // }
    
    // const admin = await User.getByUid(currentUser.uid);
    const admin = { uid: 'admin', adm_name: 'Admin' }; // استخدام بيانات افتراضية
    await this.update({
      reviewStatus: 'rejected',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason,
    });

    // TODO: إضافة نظام الإشعارات لاحقاً
    // await new Notification({
    //   receiver_id: this.userId,
    //   title: '❌ تم رفض إعلانك العقاري',
    //   body: `تم رفض إعلانك "${this.developer_name}". السبب: ${
    //     reason || 'غير مذكور'
    //   }`,
    //   type: 'system',
    //   link: `/client/developer-ads/${this.#id}`,
    // }).send();
  }

  // 🔁 إعادة الإعلان لحالة "pending"
  async returnToPending() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل إعادة العقار للمراجعة");
    // }
    
    // const admin = await User.getByUid(currentUser.uid);
    const admin = { uid: 'admin', adm_name: 'Admin' }; // استخدام بيانات افتراضية
    await this.update({
      reviewStatus: 'pending',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });

    // TODO: إضافة نظام الإشعارات لاحقاً
    // await new Notification({
    //   receiver_id: this.userId,
    //   title: '🔄 إعلانك الآن قيد المراجعة',
    //   body: `تمت إعادة إعلانك "${this.developer_name}" للمراجعة.`,
    //   type: 'system',
    //   link: `/client/developer-ads/${this.#id}`,
    // }).send();
  }

  // ⏳ تفعيل الإعلان لفترة معينة
  async adsActivation(days) {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل تفعيل العقار");
    // }
    
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  // ❌ إلغاء التفعيل
  async removeAds() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل إلغاء تفعيل العقار");
    // }
    
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  // 📥 جلب إعلان واحد بالـ ID
  static async getById(id) {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل جلب بيانات العقار");
    // }
    
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const advertisement = new RealEstateDeveloperAdvertisement({
        ...data,
        id: snap.id // إضافة الـ ID بشكل صريح
      });
      return advertisement;
    }
    return null;
  }

  // 📥 جلب كل الإعلانات
  static async getAll() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل جلب قائمة العقارات");
    // }
    
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل جلب العقارات حسب حالة المراجعة");
    // }
    
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل جلب عقارات المستخدم");
    // }
    
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات");
    // }
    
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات المفعلة");
    // }
    
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات");
    // }
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً قبل رفع الصور");
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
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً قبل رفع الإيصال");
    const storage = getStorage();
    const refPath = ref(storage, `property_images/${this.userId}/receipt.jpg`);
    await uploadBytes(refPath, file);
    return await getDownloadURL(refPath);
  }

  // 🗑️ حذف كل الصور
  async #deleteAllImages() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل حذف الصور");
    // }
    
    const dirRef = ref(getStorage(), `property_images/${this.userId}`);
    try {
      const list = await listAll(dirRef);
      for (const fileRef of list.items) await deleteObject(fileRef);
    } catch (_) {}
  }

  // 🗑️ حذف إيصال الدفع
  async #deleteReceipt() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل حذف الإيصال");
    // }
    
    const fileRef = ref(getStorage(), `property_images/${this.userId}/receipt.jpg`);
    try {
      await deleteObject(fileRef);
    } catch (_) {}
  }

  // 📤 تجهيز بيانات الإعلان للتخزين
  #getAdData() {
    // تم تجاهل فحص تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل تجهيز بيانات العقار");
    // }
    
    // استخراج معلومات الباقة إذا كانت موجودة
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
    
    // إضافة الـ ID إذا كان موجوداً
    if (this.#id) {
      data.id = this.#id;
    }
    
    return data;
  }
}



// import {
//   doc,
//   setDoc,
//   getDoc,
//   deleteDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   Timestamp,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore";
// import { db, auth } from "../firebaseConfig";

// class FinancingRequest {
//   constructor(data) {
//     const currentUser = auth.currentUser;

//     if (!data?.user_id && !currentUser?.uid) {
//       throw new Error(
//         "لا يمكن إنشاء كائن الطلب: لم يتم تمرير user_id، ولا يوجد مستخدم مسجل دخول."
//       );
//     }

//     this.id = data?.id || doc(collection(db, "FinancingRequests")).id;
//     this.user_id = data?.user_id || currentUser.uid;
//     this.advertisement_id = data?.advertisement_id || "";
//     this.monthly_income = data?.monthly_income || 0;
//     this.job_title = data?.job_title || "";
//     this.employer = data?.employer || "";
//     this.age = data?.age || 0;
//     this.marital_status = data?.marital_status || "";
//     this.dependents = data?.dependents || 0;
//     this.financing_amount = data?.financing_amount || 0;
//     this.repayment_years = data?.repayment_years || 1;
//     this.status = data?.status || "pending";
//     this.submitted_at = data?.submitted_at || Timestamp.now();
//   }

//   getRef() {
//     return doc(db, "FinancingRequests", this.id);
//   }

//   async save() {
//     await setDoc(this.getRef(), { ...this });
//   }

//   async update() {
//     await updateDoc(this.getRef(), { ...this });
//   }

//   async delete() {
//     await deleteDoc(this.getRef());
//   }

//   static async getById(id) {
//     const snap = await getDoc(doc(db, "FinancingRequests", id));
//     if (!snap.exists()) return null;
//     return new FinancingRequest(snap.data());
//   }

//   static subscribeByUser(userId, callback) {
//     return onSnapshot(
//       query(
//         collection(db, "FinancingRequests"),
//         where("user_id", "==", userId)
//       ),
//       (snapshot) => {
//         const requests = snapshot.docs.map((doc) => new FinancingRequest(doc.data()));
//         callback(requests);
//       }
//     );
//   }

//   async calculateMonthlyInstallment() {
//     const adSnap = await getDoc(
//       doc(db, "FinancingAdvertisements", this.advertisement_id)
//     );
//     if (!adSnap.exists()) return null;

//     const ad = adSnap.data();

//     let interestRate = 0.14;
//     if (this.repayment_years <= 5) {
//       interestRate = ad.interest_rate_upto_5;
//     } else if (this.repayment_years <= 10) {
//       interestRate = ad.interest_rate_upto_10;
//     } else {
//       interestRate = ad.interest_rate_above_10;
//     }

//     const totalInterest =
//       this.financing_amount * (interestRate / 100) * this.repayment_years;
//     const totalPayable = this.financing_amount + totalInterest;
//     const monthlyInstallment = totalPayable / (this.repayment_years * 12);

//     return {
//       interestRate,
//       totalInterest,
//       totalPayable,
//       monthlyInstallment,
//     };
//   }
// }

// export default FinancingRequest;

export default RealEstateDeveloperAdvertisement;
