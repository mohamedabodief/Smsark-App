import {
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

class Favorite {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.user_id = data.user_id;
    this.advertisement_id = data.advertisement_id;
    this.saved_at = data.saved_at || Timestamp.now();
  }

  get id() {
    return this.#id;
  }

  // حفظ في قاعدة البيانات
  async save() {
    const colRef = collection(db, 'Favorites');
    const docRef = await addDoc(colRef, {
      user_id: this.user_id,
      advertisement_id: this.advertisement_id,
      saved_at: this.saved_at,
    });
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    return this.#id;
  }

  // حذف من قاعدة البيانات
  async delete() {
    if (!this.#id) throw new Error('Favorite بدون ID للحذف');
    const docRef = doc(db, 'Favorites', this.#id);
    await deleteDoc(docRef);
  }

  // جلب مفضلة معينة بالـ ID
  static async getById(id) {
    const docRef = doc(db, 'Favorites', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new Favorite({ id, ...snapshot.data() });
    }
    return null;
  }

  // استماع لحظي لمفضلات مستخدم معين
  static subscribeByUser(userId, callback) {
    const colRef = collection(db, 'Favorites');
    const q = query(colRef, where('user_id', '==', userId));
    return onSnapshot(q, (querySnapshot) => {
      const favorites = querySnapshot.docs.map(
        (docSnap) => new Favorite({ id: docSnap.id, ...docSnap.data() })
      );
      callback(favorites);
    });
  }

  // التحقق هل إعلان معين محفوظ من قبل مستخدم معين
  static async isFavorited(userId, advertisementId) {
    const colRef = collection(db, 'Favorites');
    const q = query(
      colRef,
      where('user_id', '==', userId),
      where('advertisement_id', '==', advertisementId)
    );
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  /**
   * دالة toggleFavorite بتعمل تبديل بين:
   *
   * ✅ إضافة الإعلان للمفضلة لو مش محفوظ.
   * ❌ حذفه من المفضلة لو محفوظ بالفعل.
   *
   * يعني بتنفع تستخدمها في زر واحد (زي القلب ❤️)، بدل ما تعمل شرط خارجي وتفصل بين save و delete.
   *
   * ترجع كائن فيه:
   *  - favorited: true → تمت الإضافة
   *  - favorited: false → تم الحذف
   *  - id: معرّف الحفظ الجديد (في حالة الإضافة فقط)
   */
  static async toggleFavorite(userId, advertisementId) {
    const colRef = collection(db, 'Favorites');
    const q = query(
      colRef,
      where('user_id', '==', userId),
      where('advertisement_id', '==', advertisementId)
    );
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // ❌ الإعلان محفوظ بالفعل → نحذفه
      const docRef = doc(db, 'Favorites', snapshot.docs[0].id);
      await deleteDoc(docRef);
      return { favorited: false };
    } else {
      // ✅ الإعلان مش محفوظ → نضيفه
      const newFavorite = new Favorite({
        user_id: userId,
        advertisement_id: advertisementId,
        saved_at: Timestamp.now(),
      });
      const newId = await newFavorite.save();
      return { favorited: true, id: newId };
    }
  }
}

export default Favorite;
