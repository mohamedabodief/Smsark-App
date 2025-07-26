import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
