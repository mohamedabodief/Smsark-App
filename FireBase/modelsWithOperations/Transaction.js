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

class Transaction {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.user_id = data.user_id;
    this.advertisement_id = data.advertisement_id;
    this.message = data.message || '';
    this.status = data.status || 'pending'; // "pending" | "contacted" | "closed"
    this.created_at = data.created_at || Timestamp.now();
  }

  get id() {
    return this.#id;
  }

  async save() {
    const colRef = collection(db, 'Transactions');
    const docRef = await addDoc(colRef, {
      user_id: this.user_id,
      advertisement_id: this.advertisement_id,
      message: this.message,
      status: this.status,
      created_at: this.created_at,
    });
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    return this.#id;
  }

  async update(updates) {
    if (!this.#id) throw new Error('Transaction بدون ID للتحديث');
    const docRef = doc(db, 'Transactions', this.#id);
    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('Transaction بدون ID للحذف');
    const docRef = doc(db, 'Transactions', this.#id);
    await deleteDoc(docRef);
  }

  static async getById(id) {
    const docRef = doc(db, 'Transactions', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new Transaction({ id, ...snapshot.data() });
    }
    return null;
  }

  /**
   * الاستماع اللحظي لجميع التفاعلات الخاصة بإعلان معين
   */
  static subscribeByAdvertisement(advertisementId, callback) {
    const colRef = collection(db, 'Transactions');
    const q = query(colRef, where('advertisement_id', '==', advertisementId));
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => new Transaction({ id: doc.id, ...doc.data() }));
      callback(transactions);
    });
  }

  /**
   * الاستماع اللحظي لجميع التفاعلات الخاصة بمستخدم معين
   */
  static subscribeByUser(userId, callback) {
    const colRef = collection(db, 'Transactions');
    const q = query(colRef, where('user_id', '==', userId));
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => new Transaction({ id: doc.id, ...doc.data() }));
      callback(transactions);
    });
  }
}

export default Transaction;
