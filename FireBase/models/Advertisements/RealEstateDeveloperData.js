//scr/FireBase/models/Advertisements/RealEstateDeveloperData.js
class RealEstateDeveloperData {
  constructor({
    developer_name, // اسم المطور العقاري
    description, // وصف عام للمطور أو المشروع
    project_types, // مصفوفة: ["شقة", "فيلا", "تجاري"]
    images, // مصفوفة روابط الصور
    phone, // رقم الهاتف
    location, // { city, governorate }
    price_start_from, // السعر يبدأ من
    price_end_to, // السعر ينتهي عند
    userId, // معرف المستخدم
    type_of_user, // دائمًا "developer"
    rooms, // عدد الغرف
    bathrooms, // عدد الحمامات
    floor, // رقم الطابق
    furnished, // مفروش؟
    status, // "جاهز للسكن" | "تحت الإنشاء"
    paymentMethod, // كاش / تقسيط / تمويل
    negotiable, // قابل للتفاوض؟
    deliveryTerms, // شروط التسليم
    features, // مصفوفة مميزات
    area, // المساحة بالمتر
    adPackage,

    // حقول المراجعة
    reviewStatus, // "pending" | "approved" | "rejected"
    reviewed_by, // بيانات الأدمن الذي راجع الإعلان
    review_note, // ملاحظات أو سبب الرفض
    receipt_image, // رابط صورة إيصال الدفع

    // حالة التفعيل المدفوع
    ads,
    adExpiryTime,
  }) {
    this.developer_name = developer_name || "";
    this.description = description || "";
    this.project_types = Array.isArray(project_types) ? project_types : [];
    this.images = Array.isArray(images) ? images : [];
    this.phone = phone || "";
    this.location = location || { city: "", governorate: "" };
    this.price_start_from =
      typeof price_start_from === "number" ? price_start_from : null;
    this.price_end_to = typeof price_end_to === "number" ? price_end_to : null;
    this.userId = userId || null;
    this.type_of_user = type_of_user || "developer";

    this.rooms = typeof rooms === "number" ? rooms : null;
    this.bathrooms = typeof bathrooms === "number" ? bathrooms : null;
    this.floor = typeof floor === "number" ? floor : null;
    this.furnished = furnished === true;
    this.status = status || null;
    this.paymentMethod = paymentMethod || null;
    this.negotiable = negotiable === true;
    this.deliveryTerms = deliveryTerms || null;
    this.features = Array.isArray(features) ? features : [];
    this.area = typeof area === "number" ? area : null;
    this.adPackage = adPackage !== undefined ? adPackage : null;

    // حالة المراجعة
    this.reviewStatus = reviewStatus || "pending";
    this.reviewed_by = reviewed_by || null;
    this.review_note = review_note || null;
    this.receipt_image = receipt_image || null;

    // إعلان مدفوع
    this.ads = ads !== undefined ? ads : false;
    this.adExpiryTime = adExpiryTime || null;
  }
}

export default RealEstateDeveloperData;
