import { Timestamp } from 'firebase/firestore';

class FavoriteData {
  constructor({ id, user_id, advertisement_id, saved_at }) {
    this.id = id || null;
    this.user_id = user_id;
    this.advertisement_id = advertisement_id;
    this.saved_at = saved_at || Timestamp.now();
  }
}

export default FavoriteData;
