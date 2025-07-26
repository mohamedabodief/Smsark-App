import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

class FinancingRequest {
  constructor(data) {
    const currentUser = auth.currentUser;

    if (!data?.user_id && !currentUser?.uid) {
      throw new Error(
        "لا يمكن إنشاء كائن الطلب: لم يتم تمرير user_id، ولا يوجد مستخدم مسجل دخول."
      );
    }

    this.id = data?.id || doc(collection(db, "FinancingRequests")).id;
    this.user_id = data?.user_id || currentUser.uid;
    this.advertisement_id = data?.advertisement_id || "";
    this.monthly_income = data?.monthly_income || 0;
    this.job_title = data?.job_title || "";
    this.employer = data?.employer || "";
    this.age = data?.age || 0;
    this.marital_status = data?.marital_status || "";
    this.dependents = data?.dependents || 0;
    this.financing_amount = data?.financing_amount || 0;
    this.repayment_years = data?.repayment_years || 1;
    this.status = data?.status || "pending";
    this.submitted_at = data?.submitted_at || Timestamp.now();
  }

  getRef() {
    return doc(db, "FinancingRequests", this.id);
  }

  async save() {
    await setDoc(this.getRef(), { ...this });
  }

  async update() {
    await updateDoc(this.getRef(), { ...this });
  }

  async delete() {
    await deleteDoc(this.getRef());
  }

  static async getById(id) {
    const snap = await getDoc(doc(db, "FinancingRequests", id));
    if (!snap.exists()) return null;
    return new FinancingRequest(snap.data());
  }

  static subscribeByUser(userId, callback) {
    return onSnapshot(
      query(
        collection(db, "FinancingRequests"),
        where("user_id", "==", userId)
      ),
      (snapshot) => {
        const requests = snapshot.docs.map((doc) => new FinancingRequest(doc.data()));
        callback(requests);
      }
    );
  }

  async calculateMonthlyInstallment() {
    const adSnap = await getDoc(
      doc(db, "FinancingAdvertisements", this.advertisement_id)
    );
    if (!adSnap.exists()) return null;

    const ad = adSnap.data();

    let interestRate = 0.14;
    if (this.repayment_years <= 5) {
      interestRate = ad.interest_rate_upto_5;
    } else if (this.repayment_years <= 10) {
      interestRate = ad.interest_rate_upto_10;
    } else {
      interestRate = ad.interest_rate_above_10;
    }

    const totalInterest =
      this.financing_amount * (interestRate / 100) * this.repayment_years;
    const totalPayable = this.financing_amount + totalInterest;
    const monthlyInstallment = totalPayable / (this.repayment_years * 12);

    return {
      interestRate,
      totalInterest,
      totalPayable,
      monthlyInstallment,
    };
  }
}

export default FinancingRequest;
