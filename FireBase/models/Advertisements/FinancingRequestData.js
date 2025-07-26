

import { Timestamp } from 'firebase/firestore';

/**
 * هيكل بيانات طلب التمويل (Data Only)
 * يُستخدم في النقل أو التهيئة دون منطق قواعد بيانات
 */
class FinancingRequestData {
  constructor({
    id,
    user_id,
    advertisement_id,
    monthly_income,
    job_title,
    employer,
    age,
    marital_status,
    dependents,
    financing_amount,
    repayment_years,
    phone_number, // ✅ مضاف: رقم الهاتف
    status,
    reviewStatus,
    submitted_at,
  }) {
    this.id = id || null;
    this.user_id = user_id;
    this.advertisement_id = advertisement_id || null;
    this.monthly_income = monthly_income;
    this.job_title = job_title;
    this.employer = employer;
    this.age = age;
    this.marital_status = marital_status;
    this.dependents = dependents;
    this.financing_amount = financing_amount;
    this.repayment_years = repayment_years;
    this.phone_number = phone_number || ''; // ✅ رقم الهاتف، افتراضيًا فارغ
    this.status = status || 'pending';
    this.reviewStatus = reviewStatus || 'pending'; // ✅ حالة المراجعة
    this.submitted_at = submitted_at || Timestamp.now();
  }
}

export default FinancingRequestData;