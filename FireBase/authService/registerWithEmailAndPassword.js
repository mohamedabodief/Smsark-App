// src/auth/registerWithEmailAndPassword.js

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import User from '../modelsWithOperations/User'; // تأكد من صحة المسار

/**
 * تسجيل مستخدم جديد
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, uid?: string, user?: object, error?: string}>}
 */
export default async function registerWithEmailAndPassword(email, password) {
  try {
    // ✅ التحقق من صحة البريد وكلمة المرور
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'البريد الإلكتروني غير صالح' };
    }
    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      };
    }

    // ✅ إنشاء مستخدم جديد
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // ✅ إنشاء كائن مستخدم جديد داخل Firestore لو ما كانش موجود
    const newUser = new User({
      uid,
      type_of_user: 'client', // 👈 عدّل لاحقًا بعد اختيار نوع المستخدم
      phone: null,
      cli_name: null,
      // أضف باقي الحقول حسب الحاجة
    });

    await newUser.saveToFirestore();

    return { success: true, uid, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء التسجيل';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'البريد الإلكتروني مستخدم من قبل';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'البريد الإلكتروني غير صالح';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    return { success: false, error: errorMessage };
  }
}
