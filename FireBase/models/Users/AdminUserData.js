class AdminUserData {
  constructor({ uid, adm_name, phone, gender, image }) {
    this.uid = uid;
    this.type_of_user = "admin";
    this.adm_name = adm_name;
    this.phone = phone;
    this.gender = gender;
    this.image = image;
  }
}

export default AdminUserData;