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
} from 'firebase/firestore';
import { db, Timestamp } from '../firebaseConfig';

export default class RealEstateDeveloperAdvertisement {
  constructor(data) {
    this.id = data.id || doc(collection(db, 'RealEstateDeveloperAdvertisement')).id;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.images = data.images || [];
    this.location = data.location;
    this.space = data.space;
    this.developer_id = data.developer_id;
    this.created_at = data.created_at || Timestamp.now();
    this.expiry_days = data.expiry_days;
    this.is_active = data.is_active ?? true;
    this.status = data.status || 'pending'; // pending | approved | rejected
    this.rejection_reason = data.rejection_reason || '';
    this.admin_note = data.admin_note || '';
  }

  async save() {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', this.id);
    await setDoc(docRef, { ...this });
  }

  async update(data) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', this.id);
    await updateDoc(docRef, data);
  }

  async delete() {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', this.id);
    await deleteDoc(docRef);
  }

  static async getById(id) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return new RealEstateDeveloperAdvertisement(snapshot.data());
  }

  static subscribeAll(callback) {
    const q = query(collection(db, 'RealEstateDeveloperAdvertisement'));
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new RealEstateDeveloperAdvertisement(doc.data()));
      callback(ads);
    });
  }

  static async getAll() {
    const q = query(collection(db, 'RealEstateDeveloperAdvertisement'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => new RealEstateDeveloperAdvertisement(doc.data()));
  }

  async approveAd(admin_note = '') {
    await this.update({ status: 'approved', admin_note });
  }

  async rejectAd(rejection_reason) {
    await this.update({ status: 'rejected', rejection_reason });
  }

  async returnToPending() {
    await this.update({ status: 'pending', rejection_reason: '', admin_note: '' });
  }

  static subscribeByDeveloperId(developerId, callback) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisement'),
      where('developer_id', '==', developerId)
    );
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new RealEstateDeveloperAdvertisement(doc.data()));
      callback(ads);
    });
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
