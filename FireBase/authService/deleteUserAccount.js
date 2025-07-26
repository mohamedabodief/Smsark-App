import { auth } from '../firebaseConfig';
import { deleteUser } from 'firebase/auth';
import User from '../modelsWithOperations/User';
import Notification from '../MessageAndNotification/Notification';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Delete user account completely from Firebase Authentication and Firestore
 * @param {string} uid - User ID to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export default async function deleteUserAccount(uid) {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser || currentUser.uid !== uid) {
      return { success: false, error: 'غير مصرح لك بحذف هذا الحساب' };
    }

    // 1. Get user data from Firestore first
    const userInstance = await User.getByUid(uid);
    if (!userInstance) {
      return { success: false, error: 'لم يتم العثور على بيانات المستخدم' };
    }

    // 2. Delete user's notifications
    try {
      await Notification.deleteAllByUser(uid);
    } catch (error) {
      console.warn('Failed to delete notifications:', error);
    }

    // 3. Delete user's favorites
    try {
      const favoritesQuery = query(collection(db, 'Favorites'), where('user_id', '==', uid));
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favoritesDeletions = favoritesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(favoritesDeletions);
    } catch (error) {
      console.warn('Failed to delete favorites:', error);
    }

    // 4. Delete user's financing requests
    try {
      const requestsQuery = query(collection(db, 'FinancingRequests'), where('user_id', '==', uid));
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsDeletions = requestsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(requestsDeletions);
    } catch (error) {
      console.warn('Failed to delete financing requests:', error);
    }

    // 5. Delete user's advertisements (if any)
    try {
      // Delete client advertisements
      const clientAdsQuery = query(collection(db, 'ClientAdvertisements'), where('userId', '==', uid));
      const clientAdsSnapshot = await getDocs(clientAdsQuery);
      const clientAdsDeletions = clientAdsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(clientAdsDeletions);

      // Delete financing advertisements
      const financingAdsQuery = query(collection(db, 'FinancingAdvertisements'), where('userId', '==', uid));
      const financingAdsSnapshot = await getDocs(financingAdsQuery);
      const financingAdsDeletions = financingAdsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(financingAdsDeletions);

      // Delete developer advertisements
      const developerAdsQuery = query(collection(db, 'RealEstateDeveloperAdvertisements'), where('userId', '==', uid));
      const developerAdsSnapshot = await getDocs(developerAdsQuery);
      const developerAdsDeletions = developerAdsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(developerAdsDeletions);

      // Delete homepage advertisements
      const homepageAdsQuery = query(collection(db, 'HomepageAdvertisements'), where('userId', '==', uid));
      const homepageAdsSnapshot = await getDocs(homepageAdsQuery);
      const homepageAdsDeletions = homepageAdsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(homepageAdsDeletions);
    } catch (error) {
      console.warn('Failed to delete advertisements:', error);
    }

    // 6. Delete user's inquiries/transactions
    try {
      const inquiriesQuery = query(collection(db, 'Transactions'), where('user_id', '==', uid));
      const inquiriesSnapshot = await getDocs(inquiriesQuery);
      const inquiriesDeletions = inquiriesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(inquiriesDeletions);
    } catch (error) {
      console.warn('Failed to delete inquiries:', error);
    }

    // 7. Delete user from Firestore
    await userInstance.deleteFromFirestore();

    // 8. Delete user from Firebase Authentication
    await deleteUser(currentUser);

    return { success: true };
  } catch (error) {
    console.error('Error deleting user account:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/requires-recent-login') {
      return { 
        success: false, 
        error: 'يجب إعادة تسجيل الدخول قبل حذف الحساب لأسباب أمنية' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'حدث خطأ أثناء حذف الحساب' 
    };
  }
} 