
// src/FireBase/models/Users/OrganizationUserData.js
export default class OrganizationUserData {
  constructor(data) {
    this.uid = data.uid;
    this.type_of_user = "organization";
    this.org_name = data.org_name;
    this.type_of_organization = data.type_of_organization;
    this.phone = data.phone;
    this.city = data.city;
    this.governorate = data.governorate;
    this.address = data.address;
    this.created_at = new Date().toISOString();
    this.profile_completed = true;
    this.verified = false;
  }
}


