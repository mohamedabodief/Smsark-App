// src/auth/loginWithEmailAndPassword.js

import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { requestForToken } from '../MessageAndNotification/firebaseMessaging';
import User from '../modelsWithOperations/User'; // تأكد من صحة المسار

/**
 * تسجيل الدخول باستخدام الإيميل والباسورد + تخزين FCM Token
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
    const uid = userCredential.user.uid;

    // ✅ جلب FCM Token
    const fcmToken = await requestForToken();

    // ✅ حفظ التوكن داخل مستند المستخدم
    if (fcmToken) {
      const userInstance = await User.getByUid(uid);
      if (userInstance) {
        await userInstance.saveFcmToken(fcmToken);
      } else {
        console.warn(`⚠️ المستخدم UID: ${uid} لم يتم العثور عليه في Firestore`);
      }
    } else {
      console.warn("⚠️ لم يتم توليد FCM Token لهذا المستخدم.");
    }

    return {
      success: true,
      uid,
      user: userCredential.user,
    };
  }  catch (error) {
    let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا';
    }
    return { success: false, error: errorMessage };
  }
}

// // src/auth/loginWithEmailAndPassword.js

// import { auth } from '../firebaseConfig';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { requestForToken } from '../MessageAndNotification/firebaseMessaging';
// import User from '../modelsWithOperations/User'; // تأكد من صحة المسار

// /**
//  * تسجيل الدخول باستخدام الإيميل والباسورد + تخزين FCM Token
//  * @param {string} email
//  * @param {string} password
//  * @returns {Promise<{success: boolean, uid?: string, user?: object, error?: string}>}
//  */
// export default async function loginWithEmailAndPassword(email, password) {
//   try {
//     // ✅ تسجيل الدخول
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const uid = userCredential.user.uid;

//     // ✅ جلب FCM Token
//     const fcmToken = await requestForToken();

//     // ✅ حفظ التوكن داخل مستند المستخدم
//     if (fcmToken) {
//       const userInstance = await User.getByUid(uid);
//       if (userInstance) {
//         await userInstance.saveFcmToken(fcmToken);
//       } else {
//         console.warn(`⚠️ المستخدم UID: ${uid} لم يتم العثور عليه في Firestore`);
//       }
//     } else {
//       console.warn("⚠️ لم يتم توليد FCM Token لهذا المستخدم.");
//     }

//     return {
//       success: true,
//       uid,
//       user: userCredential.user,
//     };
//   }  catch (error) {
//     let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
//     if (error.code === 'auth/invalid-credential') {
//       errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
//     } else if (error.code === 'auth/too-many-requests') {
//       errorMessage = 'تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا';
//     }
//     return { success: false, error: errorMessage };
//   }
// }


