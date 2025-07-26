import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

export default class HomepageAdvertisement {
  #id;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title || '';
    this.image = data.image || '';
    this.link = data.link || '';
    this.receipt_image = data.receipt_image || '';
    this.adDays = data.adDays || 1;
    this.createdAt = data.createdAt || Date.now();
    this.status = data.status || 'pending';
    this.rejection_note = data.rejection_note || '';
    this.user_id = data.user_id;
    this.price = data.price || 0;
  }

  get id() {
    return this.#id;
  }

  #getAdData() {
    return {
      title: this.title,
      image: this.image,
      link: this.link,
      receipt_image: this.receipt_image,
      adDays: this.adDays,
      createdAt: this.createdAt,
      status: this.status,
      rejection_note: this.rejection_note,
      user_id: this.user_id,
      price: this.price,
    };
  }

  async save(imageFile = null, receiptFile = null) {
    this.createdAt = Date.now();
    const colRef = collection(db, 'HomepageAdvertisements');

    if (!this.title) {
      this.title = 'إعلان بدون عنوان';
    }

    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    if (imageFile) {
      const imageUrl = await this.#uploadImage(imageFile);
      this.image = imageUrl;
      await updateDoc(docRef, { image: imageUrl });
    }

    if (receiptFile) {
      const receiptUrl = await this.#uploadReceipt(receiptFile);
      this.receipt_image = receiptUrl;
      await updateDoc(docRef, { receipt_image: receiptUrl });
    }

    return this.#id;
  }

  async update(data = {}) {
    const docRef = doc(db, 'HomepageAdvertisements', this.#id);
    const updatedData = { ...this.#getAdData(), ...data };
    await updateDoc(docRef, updatedData);
  }

  async delete() {
    const docRef = doc(db, 'HomepageAdvertisements', this.#id);
    await deleteDoc(docRef);

    if (this.image) {
      const imageRef = ref(storage, this.image);
      await deleteObject(imageRef).catch(() => {});
    }

    if (this.receipt_image) {
      const receiptRef = ref(storage, this.receipt_image);
      await deleteObject(receiptRef).catch(() => {});
    }
  }

  async #uploadImage(file) {
    const storageRef = ref(storage, `homepageAds/${this.#id}/image`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async #uploadReceipt(file) {
    const storageRef = ref(storage, `homepageAds/${this.#id}/receipt`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  static async getById(id) {
    const docRef = doc(db, 'HomepageAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return new HomepageAdvertisement(snapshot.data());
  }

  static async getAll() {
    const colRef = collection(db, 'HomepageAdvertisements');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => new HomepageAdvertisement(doc.data()));
  }

  static subscribe(callback) {
    const colRef = collection(db, 'HomepageAdvertisements');
    return onSnapshot(colRef, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new HomepageAdvertisement(doc.data()));
      callback(ads);
    });
  }

  static subscribeByUser(user_id, callback) {
    const q = query(
      collection(db, 'HomepageAdvertisements'),
      where('user_id', '==', user_id)
    );
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => new HomepageAdvertisement(doc.data()));
      callback(ads);
    });
  }
}
