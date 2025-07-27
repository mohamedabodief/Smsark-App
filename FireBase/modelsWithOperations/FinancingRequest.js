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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

class FinancingRequest {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.user_id = data.user_id;
    this.advertisement_id = data.advertisement_id || null;
    this.monthly_income = data.monthly_income;
    this.job_title = data.job_title;
    this.employer = data.employer;
    this.age = data.age;
    this.marital_status = data.marital_status;
    this.dependents = data.dependents;
    this.financing_amount = data.financing_amount;
    this.repayment_years = data.repayment_years;
    this.phone_number = data.phone_number || '';
    this.status = data.status || 'pending';
    this.reviewStatus = data.reviewStatus || 'pending';
    this.submitted_at = data.submitted_at || Timestamp.now();
  }

  get id() {
    return this.#id;
  }

  async save() {
    if (!this.advertisement_id) {
      throw new Error('لم يتم تمرير معرّف إعلان التمويل.');
    }

    const ad = await this.getAdvertisement();
    if (!ad) throw new Error('إعلان التمويل غير موجود.');

    const adData = ad;
    const colRef = collection(db, 'FinancingRequests');
    const docRef = await addDoc(colRef, {
      user_id: this.user_id,
      advertisement_id: this.advertisement_id,
      advertisement_title: adData.title || '',
      monthly_income: this.monthly_income,
      job_title: this.job_title,
      employer: this.employer,
      age: this.age,
      marital_status: this.marital_status,
      dependents: this.dependents,
      financing_amount: this.financing_amount,
      repayment_years: this.repayment_years,
      phone_number: this.phone_number,
      status: this.status,
      reviewStatus: this.reviewStatus,
      submitted_at: this.submitted_at,
    });

    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    return this.#id;
  }

  async update(updates) {
    if (!this.#id) throw new Error('الطلب بدون ID غير قابل للتحديث');
    const docRef = doc(db, 'FinancingRequests', this.#id);
    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('الطلب بدون ID غير قابل للحذف');
    const docRef = doc(db, 'FinancingRequests', this.#id);
    await deleteDoc(docRef);
  }

  static async getById(id) {
    const docRef = doc(db, 'FinancingRequests', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new FinancingRequest({ id, ...snapshot.data() });
    }
    return null;
  }

  static subscribeByUser(userId, callback) {
    const q = query(collection(db, 'FinancingRequests'), where('user_id', '==', userId));
    return onSnapshot(q, (snap) => {
      const requests = snap.docs.map((doc) => new FinancingRequest({ id: doc.id, ...doc.data() }));
      callback(requests);
    });
  }

  static subscribeByStatus(status, callback) {
    const q = query(collection(db, 'FinancingRequests'), where('reviewStatus', '==', status));
    return onSnapshot(q, (snap) => {
      const requests = snap.docs.map((doc) => new FinancingRequest({ id: doc.id, ...doc.data() }));
      callback(requests);
    });
  }

  static async getByReviewStatus(status) {
    const q = query(collection(db, 'FinancingRequests'), where('reviewStatus', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => new FinancingRequest({ id: doc.id, ...doc.data() }));
  }

  async returnToPending() {
    this.reviewStatus = 'pending';
    await this.update({ reviewStatus: 'pending' });
  }

  async reject(reason = 'لم يتم توضيح السبب') {
    this.reviewStatus = 'rejected';
    await this.update({ reviewStatus: 'rejected' });
  }

  async calculateMonthlyInstallment() {
    const principal = this.financing_amount;
    const years = this.repayment_years;

    if (!principal || !years) return '0.00';

    const ad = await this.getAdvertisement();
    if (!ad) throw new Error('❌ إعلان التمويل غير موجود.');

    const MIN = ad.start_limit;
    const MAX = ad.end_limit;

    if (principal < MIN || principal > MAX) {
      throw new Error(`❌ مبلغ التمويل يجب أن يكون بين ${MIN} و ${MAX}`);
    }

    let annualRate;
    if (years <= 5) annualRate = ad.interest_rate_upto_5;
    else if (years <= 10) annualRate = ad.interest_rate_upto_10;
    else annualRate = ad.interest_rate_above_10;

    const r = annualRate / 12 / 100;
    const n = years * 12;

    const monthlyInstallment =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return monthlyInstallment.toFixed(2);
  }

  async getAdvertisement() {
    if (!this.advertisement_id) return null;
    const adRef = doc(db, 'FinancingAdvertisements', this.advertisement_id);
    const adSnap = await getDoc(adRef);
    if (adSnap.exists()) {
      const { default: FinancingAdvertisement } = await import('./FinancingAdvertisement.js');
      return new FinancingAdvertisement({ id: adSnap.id, ...adSnap.data() });
    }
    return null;
  }

  static async getByAdvertisementId(advertisement_id) {
    const q = query(collection(db, 'FinancingRequests'), where('advertisement_id', '==', advertisement_id));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => new FinancingRequest({ id: doc.id, ...doc.data() }));
  }

  static subscribeByAdvertisementId(advertisement_id, callback) {
    const q = query(collection(db, 'FinancingRequests'), where('advertisement_id', '==', advertisement_id));
    return onSnapshot(q, (snap) => {
      const requests = snap.docs.map((doc) => new FinancingRequest({ id: doc.id, ...doc.data() }));
      callback(requests);
    });
  }


}

export default FinancingRequest;
