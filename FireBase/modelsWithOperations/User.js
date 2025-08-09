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

import { db, auth } from '../firebaseConfig';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

class User {
  static allowedUserTypes = ['admin', 'client', 'organization'];

  constructor(data) {
    const uid = data.uid || auth.currentUser?.uid;

    if (!uid) {
      throw new Error(
        '❌ لا يمكن إنشاء كائن المستخدم: لم يتم تمرير UID، ولا يوجد مستخدم مسجل دخول في Firebase Auth.'
      );
    }

    if (
      data.type_of_user &&
      !User.allowedUserTypes.includes(data.type_of_user)
    ) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    this.uid = uid;
    this.type_of_user = data.type_of_user || null;

    this.phone = data.phone || null;
    this.image = data.image || null;
    this.city = data.city || null;
    this.governorate = data.governorate || null;
    this.address = data.address || null;

    // Client
    this.cli_name = data.cli_name || null;
    this.gender = data.gender || null;
    this.age = data.age || null;

    // Organization
    this.org_name = data.org_name || null;
    this.type_of_organization = data.type_of_organization || null;

    // Admin
    this.adm_name = data.adm_name || null;
  }

  static fromClientData(clientData) {
    return new User(clientData);
  }

  static fromOrganizationData(orgData) {
    return new User(orgData);
  }

  static fromAdminData(adminData) {
    return new User(adminData);
  }

async saveToFirestore(imageFile = null) {
  const docRef = doc(db, 'users', this.uid);

  if (imageFile) {
    const imageUrl = await this.#uploadImage(imageFile);
    this.image = imageUrl;
  }

  const userData = {
    uid: this.uid,
    type_of_user: this.type_of_user,
    phone: this.phone,
    image: this.image,
    city: this.city,
    governorate: this.governorate,
    address: this.address,
    cli_name: this.cli_name,
    gender: this.gender,
    age: this.age,
    org_name: this.org_name,
    type_of_organization: this.type_of_organization,
    adm_name: this.adm_name,
    profile_completed: this.profile_completed || false,
    created_at: this.created_at || new Date().toISOString(),
    fcm_token: this.fcm_token || '',
  };

  await setDoc(docRef, userData);
}


  async updateInFirestore(updates, newImageFile = null) {
    if (
      updates.type_of_user &&
      !User.allowedUserTypes.includes(updates.type_of_user)
    ) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    const docRef = doc(db, 'users', this.uid);

    if (newImageFile) {
      if (this.image) {
        await this.#deleteImage(this.image);
      }
      const newImageUrl = await this.#uploadImage(newImageFile);
      updates.image = newImageUrl;
      this.image = newImageUrl;
    }

    await updateDoc(docRef, updates);
  }

  async deleteFromFirestore() {
    const docRef = doc(db, 'users', this.uid);

    if (this.image) {
      await this.#deleteImage(this.image);
    }

    await deleteDoc(docRef);
  }

  static async getByUid(uid) {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new User({ uid, ...snapshot.data() });
    }
    return null;
  }

  static async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(
      (doc) => new User({ uid: doc.id, ...doc.data() })
    );
  }

  static async getAllUsersByType(type) {
    if (!User.allowedUserTypes.includes(type)) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('type_of_user', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => new User({ uid: doc.id, ...doc.data() })
    );
  }

  async #uploadImage(file) {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${this.uid}/profile.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  async #deleteImage(imageUrl) {
    try {
      const storage = getStorage();
      const path = decodeURIComponent(
        new URL(imageUrl).pathname.split('/o/')[1].split('?')[0]
      );
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    } catch (error) {
 
    }
  }

  static subscribeToUser(uid, callback) {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const user = new User({ uid, ...snapshot.data() });
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export default User;
