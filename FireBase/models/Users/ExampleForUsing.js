const clientData = new ClientUserData({
  uid: "<user_uid_from_auth>",
  cli_name: "أحمد علي",
  phone: "0123456789",
  gender: "male",
  age: 25,
  image: "https://example.com/images/client_profile.png",
  city: "المنصورة",
  governorate: "الدقهلية",
  address: { street: "شارع الجمهورية", building: "عمارة 12" }
});

const clientUser = User.fromClientData(clientData); // ✅ User جاهز
console.log(clientUser);

const orgData = new OrganizationUserData({
  uid: "<user_uid_from_auth>",
  org_name: "شركة مصر للتمويل",
  type_of_organization: "تمويل عقاري",
  phone: "0100000000",
  image: "https://example.com/images/org_logo.png",
  city: "القاهرة",
  governorate: "القاهرة",
  address: { street: "شارع التحرير", building: "البرج 5" }
});

const orgUser = User.fromOrganizationData(orgData); // ✅ User جاهز
