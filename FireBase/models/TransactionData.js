class TransactionData {
  constructor({ id, user_id, advertisement_id, message, status, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.advertisement_id = advertisement_id;
    this.message = message || '';
    this.status = status || 'pending'; // "pending" | "contacted" | "closed"
    this.created_at = created_at || null;
  }
}

export default TransactionData;
