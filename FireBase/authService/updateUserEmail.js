import { auth } from '../firebaseConfig';
import { updateEmail } from 'firebase/auth';

export default async function updateUserEmail(newEmail) {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: 'المستخدم غير مسجّل الدخول.' };
  }

  try {
    await updateEmail(user, newEmail);
    return { success: true, message: 'تم تحديث الإيميل بنجاح.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// دالة تحديث الإيميل (في حال المستخدم مسجّل الدخول)
