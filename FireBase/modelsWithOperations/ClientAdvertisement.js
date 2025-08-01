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
import { db } from '../firebaseConfig';

export default class ClientAdvertisement {
  constructor(data) {
    this.id = data.id || doc(collection(db, 'ClientAdvertisements')).id;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.images = data.images || [];
    this.location = data.location;
    this.governorate = data.governorate;
    this.city = data.city;
    this.space = data.space;
    this.developer_id = data.developer_id;
    this.created_at = data.created_at;
    this.expiry_days = data.expiry_days;
    this.is_active = data.is_active ?? true;
    this.status = data.status || 'pending';
    this.rejection_reason = data.rejection_reason || '';
    this.admin_note = data.admin_note || '';
    this.type = data.type;
    this.ad_type = data.ad_type;
    this.reviewStatus = data.reviewStatus || 'pending';
  }

  async save() {
    const docRef = doc(db, 'ClientAdvertisements', this.id);
    await setDoc(docRef, { ...this });
  }

  async update(data) {
    const docRef = doc(db, 'ClientAdvertisements', this.id);
    await updateDoc(docRef, data);
  }

  async delete() {
    const docRef = doc(db, 'ClientAdvertisements', this.id);
    await deleteDoc(docRef);
  }

  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, "ClientAdvertisements", data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new ClientAdvertisement(data);
  }

  static async getById(id) {
  const docRef = doc(db, 'ClientAdvertisements', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = await ClientAdvertisement.#handleExpiry(snapshot.data());
    return { ...data, id }; // ✅ لازم ترجع id هنا
  }
  return null;
}

  static subscribeAll(callback) {
    const q = query(collection(db, 'ClientAdvertisements'));
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) =>
        new ClientAdvertisement({ id: doc.id, ...doc.data() })
      );
      callback(ads);
    });
  }

  static async getAll() {
    const q = query(collection(db, 'ClientAdvertisements'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) =>
      new ClientAdvertisement({ id: doc.id, ...doc.data() })
    );
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
      collection(db, 'ClientAdvertisements'),
      where('developer_id', '==', developerId)
    );
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) =>
        new ClientAdvertisement({ id: doc.id, ...doc.data() })
      );
      callback(ads);
    });
  }
}
