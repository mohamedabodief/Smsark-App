import RealEstateDeveloperAdvertisement from "../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement";

const mockAds = [
  {
    title: 'كمبوند النرجس',
    developerName: 'الشركة المصرية للتطوير',
    location: 'القاهرة الجديدة',
    description: 'مشروع سكني متكامل',
    imageUrls: ['https://media.prefabex.com/media/_76prefabricated%20houses.jpg'],
    price: '1500000 - 3000000',
    deliveryDate: '2026-01-01',
    contactNumber: '01001234567',
    area: '160',
    status: 'approved',
  },
  {
    title: 'كمبوند اللوتس',
    developerName: 'شركة المستقبل',
    location: '6 أكتوبر',
    description: 'وحدات فاخرة بأسعار مميزة',
    imageUrls: ['https://image.winudf.com/v2/image1/Y29tLnNhZWVkMjAwM25ld2FwcGxpY2F0aW9uc2JqMTQ3LmFwcDE0N19zY3JlZW5fMF8xNjMzNTk2MzM1XzA2OQ/screen-0.jpg?fakeurl=1&type=.jpg'],
    price: '1200000 - 2500000',
    deliveryDate: '2025-12-01',
    contactNumber: '01009876543',
    area: '150',
    status: 'approved',
  },
  {
    title: 'كمبوند الزهور',
    developerName: 'شركة النخيل',
    location: 'العاصمة الإدارية',
    description: 'حياة راقية بأسعار منافسة',
    imageUrls: ['https://image.winudf.com/v2/image1/Y29tLnNhZWVkMjAwM25ld2FwcGxpY2F0aW9uc2JqMTQ3LmFwcDE0N19zY3JlZW5fN18xNjMzNTk2MzQ1XzA3NA/screen-7.jpg?fakeurl=1&type=.jpg'],
    price: '1800000 - 3200000',
    deliveryDate: '2027-03-15',
    contactNumber: '01007654321',
    area: '180',
    status: 'approved',
  },
];

const seed = async () => {
  try {
    for (const ad of mockAds) {
      await RealEstateDeveloperAdvertisement.create(ad);
      console.log(`✅ تمت إضافة: ${ad.title}`);
    }
  } catch (error) {
    console.error('❌ خطأ أثناء الإضافة:', error);
  }
};

seed();
export default seed;