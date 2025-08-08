import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const storeContactMessage = async (contactData) => {
  try {
    // التحقق من صحة البيانات
    if (!contactData.name || !contactData.email || !contactData.subject) {
      return {
        success: false,
        error: 'يرجى ملء جميع الحقول المطلوبة'
      };
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return {
        success: false,
        error: 'يرجى إدخال بريد إلكتروني صحيح'
      };
    }

    // إضافة الرسالة إلى Firestore
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      subject: contactData.subject,
      message: contactData.message || '',
      timestamp: new Date(),
      status: 'pending' // pending, read, replied
    });

  

    return {
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      messageId: docRef.id
    };

  } catch (error) {

    return {
      success: false,
      error: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
    };
  }
};

export default storeContactMessage; 