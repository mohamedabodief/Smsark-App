// src/auth/loginWithEmailAndPassword.js

import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * تسجيل الدخول باستخدام الإيميل والباسورد فقط
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, uid?: string, user?: object, error?: string}>}
 */
export default async function loginWithEmailAndPassword(email, password) {
  try {
    // ✅ تسجيل الدخول
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      uid: userCredential.user.uid,
      user: userCredential.user,
    };
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا';
    }
    return { success: false, error: errorMessage };
  }
}
