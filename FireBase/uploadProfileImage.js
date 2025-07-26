import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "./firebaseConfig";

/**
 * Uploads a profile image to Firebase Storage and returns the download URL.
 * @param {File} file - The image file to upload.
 * @param {string} uid - The user ID (if not provided, uses current user).
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export async function uploadProfileImage(file, uid = null) {
  const storage = getStorage();
  const userId = uid || auth.currentUser?.uid;
  if (!userId) throw new Error("No user ID for profile image upload.");

  const storageRef = ref(storage, `profileImages/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
} 