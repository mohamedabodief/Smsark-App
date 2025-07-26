import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export default async function sendResetPasswordEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.',
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
