class FinancingAdvertisementData {
  constructor({
    title,
    description,
    financing_model,
    images,
    phone,
    start_limit,
    end_limit,
    org_name,
    userId,
    interest_rate_upto_5,
    interest_rate_upto_10,
    interest_rate_above_10,
    receipt_image,
    reviewStatus, // "pending" | "approved" | "rejected"
    reviewed_by,  // معلومات الأدمن الذي راجع الإعلان
    review_note,  // ملاحظات المراجعة أو سبب الرفض
    ads,          // هل الإعلان مفعّل؟
    adExpiryTime, // وقت انتهاء التفعيل (timestamp)
    adPackage,
  }) {
    this.title = title || '';
    this.description = description || '';
    this.financing_model = financing_model || '';
    this.images = Array.isArray(images) ? images : [];
    this.phone = phone || '';
    this.start_limit = typeof start_limit === 'number' ? start_limit : null;
    this.end_limit = typeof end_limit === 'number' ? end_limit : null;
    this.org_name = org_name || '';
    this.userId = userId || null;

    this.type_of_user = 'organization'; // دائمًا من النوع منظمة

    // نسب الفائدة حسب مدة السداد
    this.interest_rate_upto_5 = typeof interest_rate_upto_5 === 'number' ? interest_rate_upto_5 : null;
    this.interest_rate_upto_10 = typeof interest_rate_upto_10 === 'number' ? interest_rate_upto_10 : null;
    this.interest_rate_above_10 = typeof interest_rate_above_10 === 'number' ? interest_rate_above_10 : null;

    // معلومات المراجعة
    this.reviewStatus = reviewStatus || 'pending'; // "pending" | "approved" | "rejected"
    this.reviewed_by = reviewed_by || null;
    this.review_note = review_note || null;
    this.receipt_image = receipt_image || null;

    // حالة الإعلان المدفوع
    this.ads = ads !== undefined ? ads : false;
    this.adExpiryTime = adExpiryTime || null;
    this.adPackage = adPackage !== undefined ? adPackage : null;
  }
}

export default FinancingAdvertisementData;
