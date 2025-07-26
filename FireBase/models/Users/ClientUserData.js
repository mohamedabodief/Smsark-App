/// src/FireBase/models/Users/ClientUserData.js
export default class ClientUserData {
  constructor(data) {
    this.uid = data.uid;
    this.type_of_user = "client";
    this.cli_name = data.cli_name;
    this.phone = data.phone;
    this.gender = data.gender;
    this.age = data.age;
    this.city = data.city;
    this.governorate = data.governorate;
    this.address = data.address;
    this.created_at = new Date().toISOString();
    this.profile_completed = true;
    this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
    this.receipt_image = data.receipt_image || null;
  }
}
