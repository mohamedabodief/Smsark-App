import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisement';
import { auth } from '../FireBase/firebaseConfig';
import Layout from '../src/Layout';

const DisplayInfoAddClientAds = ({ route, navigation }) => {
  const { formData, images, receipt } = route.params || {};
  const [loading, setLoading] = useState(false);
  const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150?text=Default+Image';
  const packages = {
    '1': 'باقة الأساس (100, 7 أيام)',
    '2': 'باقة النخبة (150 جنيه, 14 يوم)',
    '3': 'باقة التميز (200 جنيه, 21 يوم)',
  };

  useEffect(() => {
    if (!formData || !images || images.length === 0 || !receipt || !formData.adPackage) {
      Alert.alert('خطأ', 'البيانات أو الصور أو صورة الإيصال أو الباقة غير متوفرة', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }
  }, [formData, images, receipt, navigation]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) throw new Error('المستخدم غير مسجل دخول');
      if (!formData || !images || images.length === 0 || !receipt || !formData.adPackage) {
        throw new Error('البيانات أو الصور أو صورة الإيصال أو الباقة غير متوفرة');
      }
      let imageFiles = [];
      if (images.length > 0) {
        imageFiles = await Promise.all(
          images.map(async (image, index) => {
            try {
              const response = await fetch(image.uri);
              if (!response.ok) throw new Error(`فشل تحميل الصورة: ${image.uri}`);
              const blob = await response.blob();
              return new File([blob], `image_${index + 1}.jpg`, { type: 'image/jpeg' });
            } catch (error) {
              console.warn(`فشل تحميل الصورة ${index + 1}:`, error);
              return null;
            }
          })
        ).then((files) => files.filter((file) => file !== null));
      }
      if (imageFiles.length === 0) {
        imageFiles = [DEFAULT_IMAGE_URL];
      }
      let receiptFile = null;
      try {
        const response = await fetch(receipt.uri);
        if (!response.ok) throw new Error(`فشل تحميل صورة الإيصال: ${receipt.uri}`);
        const blob = await response.blob();
        receiptFile = new File([blob], `receipt.jpg`, { type: 'image/jpeg' });
      } catch (error) {
        throw new Error(`فشل تحميل صورة الإيصال: ${error.message}`);
      }

      const advertisementData = {
        title: formData.title,
        type: formData.propertyType,
        price: parseFloat(formData.price),
        space: parseFloat(formData.area),
        building_date: formData.buildingDate,
        address: formData.fullAddress,
        city: formData.city,
        governorate: formData.governorate,
        phone: formData.phone,
        username: formData.username,
        ad_type: formData.adType,
        status: formData.adStatus,
        description: formData.description,
        adPackage: formData.adPackage,
        userId: auth.currentUser.uid,
        location: `${formData.city}, ${formData.governorate}`,
        created_at: new Date().toISOString(),
        expiry_days: 30,
        is_active: true,
        reviewStatus: 'pending',
      };

      // التحقق من اكتمال الحقول
      Object.keys(advertisementData).forEach((key) => {
        if (advertisementData[key] === undefined || advertisementData[key] === null) {
          throw new Error(`حقل ${key} غير مكتمل`);
        }
      });

      const advertisement = new ClientAdvertisement(advertisementData);
      await advertisement.save(imageFiles, receiptFile);

      Alert.alert(
        'نجح الإرسال',
        'تم رفع إعلانك وهو الآن قيد المراجعة',
        [{ text: 'حسناً', onPress: () => navigation.navigate('MyAds') }]
      );
    } catch (error) {
      Alert.alert(
        'خطأ في الإرسال',
        `حدث خطأ أثناء حفظ الإعلان: ${error.message || 'يرجى المحاولة مرة أخرى.'}`,
        [
          { text: 'إعادة المحاولة', onPress: handleSubmit },
          { text: 'إلغاء' },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const translate = {
    title: 'عنوان الإعلان',
    propertyType: 'نوع العقار',
    price: 'السعر',
    area: 'المساحة',
    buildingDate: 'تاريخ البناء',
    fullAddress: 'العنوان التفصيلي',
    city: 'المدينة',
    governorate: 'المحافظة',
    phone: 'رقم الهاتف',
    username: 'اسم المستخدم',
    adType: 'نوع الإعلان',
    adStatus: 'حالة الإعلان',
    description: 'الوصف',
    adPackage: 'الباقة',
  };

  if (!formData || !images || images.length === 0 || !receipt || !formData.adPackage) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  return (
    <Layout>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>مراجعة بيانات الإعلان</Text>
            <Text style={styles.subtitle}>راجع البيانات قبل الإرسال النهائي</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 المعلومات الأساسية</Text>
            {Object.entries({
              title: formData.title,
              propertyType: formData.propertyType,
              price: `${formData.price} جنيه`,
              area: `${formData.area} متر مربع`,
              buildingDate: formData.buildingDate,
              adPackage: packages[formData.adPackage] || 'غير محدد',
            }).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>{translate[key]}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 الصور المرفقة</Text>
            <View style={styles.imagePreviewContainer}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri || DEFAULT_IMAGE_URL }}
                  style={{ width: 100, height: 100, borderRadius: 12, marginRight: 8, marginBottom: 16 }}
                  onError={() => {
                    Alert.alert('خطأ', 'لا يمكن تحميل الصورة المختارة.');
                  }}
                />
              ))}
            </View>
            <Text style={styles.imageCount}>عدد الصور: {images.length}</Text>
            <Text style={styles.sectionTitle}>📄 صورة الإيصال</Text>
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: receipt.uri || DEFAULT_IMAGE_URL }}
                style={{ width: 100, height: 100, borderRadius: 12, marginRight: 8, marginBottom: 16 }}
                onError={() => {
                  Alert.alert('خطأ', 'لا يمكن تحميل صورة الإيصال.');
                }}
              />
            </View>
            <Text style={styles.imageCount}>تم إضافة صورة الإيصال</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 تفاصيل الموقع</Text>
            {Object.entries({
              fullAddress: formData.fullAddress,
              city: formData.city,
              governorate: formData.governorate,
            }).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>{translate[key]}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📞 معلومات التواصل</Text>
            {Object.entries({
              phone: formData.phone,
              username: formData.username,
            }).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>{translate[key]}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 تفاصيل الإعلان</Text>
            {Object.entries({
              adType: formData.adType,
              adStatus: formData.adStatus,
            }).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>{translate[key]}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
            <View style={styles.descriptionRow}>
              <Text style={styles.label}>{translate.description}</Text>
              <Text style={styles.descriptionValue}>{formData.description}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4D00B1" />
                <Text style={styles.loadingText}>جاري الإرسال...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>إرسال الإعلان</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.backButtonText}>عودة للتعديل</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4D00B1',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    writingDirection: 'rtl',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D00B1',
    marginBottom: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  descriptionRow: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    writingDirection: 'rtl',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
    writingDirection: 'rtl',
  },
  value: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    flex: 1,
    marginRight: 10,
    writingDirection: 'rtl',
  },
  descriptionValue: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
    lineHeight: 22,
    writingDirection: 'rtl',
  },
  imagePreviewContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imageCount: {
    color: '#28a745',
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  submitButton: {
    backgroundColor: '#4D00B1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4D00B1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4D00B1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  backButtonText: {
    color: '#4D00B1',
    fontSize: 18,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4D00B1',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});

export default DisplayInfoAddClientAds;