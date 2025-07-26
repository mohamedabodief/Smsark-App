import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, Timestamp } from '../firebaseConfig';

export default class RealEstateDeveloperAdvertisement {
  constructor(data) {
    this.id = data.id || doc(collection(db, 'RealEstateDeveloperAdvertisement')).id;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.images = data.images || [];
    this.location = data.location;
    this.space = data.space;
    this.developer_id = data.developer_id;
    this.created_at = data.created_at || Timestamp.now();
    this.expiry_days = data.expiry_days;
    this.is_active = data.is_active ?? true;
    this.status = data.status || 'pending'; // pending | approved | rejected
    this.rejection_reason = data.rejection_reason || '';
    this.admin_note = data.admin_note || '';
  }

  async save() {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', this.id);
    await setDoc(docRef, { ...this });
  }

  async update(data) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', this.id);
    await updateDoc(docRef, data);
  }

  async delete() {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', this.id);
    await deleteDoc(docRef);
  }

  static async getById(id) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisement', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return new RealEstateDeveloperAdvertisement(snapshot.data());
  }

  static subscribeAll(callback) {
    const q = query(collection(db, 'RealEstateDeveloperAdvertisement'));
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new RealEstateDeveloperAdvertisement(doc.data()));
      callback(ads);
    });
  }

  static async getAll() {
    const q = query(collection(db, 'RealEstateDeveloperAdvertisement'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => new RealEstateDeveloperAdvertisement(doc.data()));
  }

  async approveAd(admin_note = '') {
    await this.update({ status: 'approved', admin_note });
  }

  async rejectAd(rejection_reason) {
    await this.update({ status: 'rejected', rejection_reason });
  }

  async returnToPending() {
    await this.update({ status: 'pending', rejection_reason: '', admin_note: '' });
  }

  static subscribeByDeveloperId(developerId, callback) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisement'),
      where('developer_id', '==', developerId)
    );
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new RealEstateDeveloperAdvertisement(doc.data()));
      callback(ads);
    });
  }
}
