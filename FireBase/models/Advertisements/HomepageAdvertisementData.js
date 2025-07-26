class HomepageAdvertisementData {
  constructor({
    image, // رابط الصورة
    ads, // هل الإعلان مفعّل؟
    adExpiryTime, // وقت انتهاء الإعلان (timestamp)
    receipt_image, // رابط إيصال الدفع
    reviewStatus, // حالة المراجعة: "pending" | "approved" | "rejected"
    reviewed_by, // بيانات المراجع (مشرف)
    review_note, // ملاحظة المراجعة إن وجدت
    userId, // معرف المستخدم الذي أنشأ الإعلان
  }) {
    this.image = image || null;
    this.ads = ads !== undefined ? ads : false;
    this.adExpiryTime = adExpiryTime || null;
    this.receipt_image = receipt_image || null;

    this.reviewStatus = reviewStatus || 'pending';
    // القيم المحتملة: "pending" | "approved" | "rejected"

    this.reviewed_by = reviewed_by || null;
    this.review_note = review_note || null;
    this.userId = userId || null;

    this.type_of_user = 'admin'; // لأن الإعلانات دي بتضاف من الأدمن غالبًا
  }
}

export default HomepageAdvertisementData;
