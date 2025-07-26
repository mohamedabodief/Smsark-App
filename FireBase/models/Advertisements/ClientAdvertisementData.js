class ClientAdvertisementData {
  constructor({
    title,
    type, // "apartment" | "villa" | "commercial"
    price,
    area,
    date_of_building,
    images,
    location,
    address,
    city,
    governorate,
    phone,
    description,
    user_name,
    userId,
    ad_type, // "بيع" | "إيجار" | "شراء"
    ad_status, // "تحت العرض" | "تحت التفاوض" | "منتهي"
    receipt_image, // رابط صورة الإيصال
    reviewStatus, // "pending" | "approved" | "rejected"
    reviewed_by, // بيانات الأدمن اللي راجع الإعلان
    review_note, // ملاحظة الرفض أو المراجعة
    ads, // هل الإعلان مفعّل؟
    adExpiryTime, // وقت انتهاء التفعيل (timestamp)
  }) {
    this.title = title || '';
    this.type = type || '';
    this.price = typeof price === 'number' ? price : null;
    this.area = typeof area === 'number' ? area : null;
    this.date_of_building = date_of_building || null;
    this.images = Array.isArray(images) ? images : [];
    this.location = location || null;
    this.address = address || '';
    this.city = city || '';
    this.governorate = governorate || '';
    this.phone = phone || '';
    this.description = description || '';
    this.user_name = user_name || '';
    this.userId = userId || null;

    this.ad_type = ad_type || '';
    // "بيع" | "إيجار" | "شراء"

    this.ad_status = ad_status || 'تحت العرض';
    // "تحت العرض" | "تحت التفاوض" | "منتهي"

    this.receipt_image = receipt_image || null;

    this.reviewStatus = reviewStatus || 'pending';
    // "pending" | "approved" | "rejected"

    this.reviewed_by = reviewed_by || null;
    this.review_note = review_note || null;

    this.ads = ads !== undefined ? ads : false;
    this.adExpiryTime = adExpiryTime || null;

    this.type_of_user = 'client';
  }
}

export default ClientAdvertisementData;
