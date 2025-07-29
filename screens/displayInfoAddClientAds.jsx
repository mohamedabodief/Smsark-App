import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisement';
import { auth } from '../FireBase/firebaseConfig';
import { storage } from '../FireBase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Layout from '../src/Layout';

const DisplayInfoAddClientAds = ({ route, navigation }) => {
  console.log('DisplayInfoAddClientAds component mounted');
  console.log('route.params:', route.params);
  
  const { formData, images } = route.params || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('DisplayInfoAddClientAds useEffect');
    console.log('formData:', formData);
    console.log('images:', images);
    
    if (!formData || !images) {
      console.error('Missing formData or images');
      Alert.alert('خطأ', 'البيانات غير متوفرة');
      navigation.goBack();
    }
  }, [formData, images, navigation]);

  // دالة لرفع الصور إلى Firebase Storage
  const uploadImagesAndGetUrls = async (imageFiles) => {
    const urls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `property_images/${auth.currentUser.uid}/${Date.now()}_${file.uri.split('/').pop()}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const imageUrls = await uploadImagesAndGetUrls(images);
      const advertisement = new ClientAdvertisement({
        title: formData.title,
        type: formData.propertyType,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        building_date: formData.buildingDate,
        address: formData.fullAddress,
        city: formData.city,
        governorate: formData.governorate,
        phone: formData.phone,
        username: formData.username,
        ad_type: formData.adType,
        status: formData.adStatus,
        description: formData.description,
        images: imageUrls,
        user_id: auth.currentUser.uid,
      });

      await advertisement.save();
      
      Alert.alert(
        'نجح الإرسال',
        'تم إضافة الإعلان بنجاح في قاعدة البيانات',
        [
          {
            text: 'حسناً',
            onPress: () => navigation.navigate('AddAds')
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting advertisement:', error);
      Alert.alert(
        'خطأ في الإرسال',
        'حدث خطأ أثناء إضافة الإعلان. يرجى المحاولة مرة أخرى.',
        [{ text: 'حسناً' }]
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
  };

  return (
    <Layout>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>مراجعة بيانات الإعلان</Text>
          <Text style={styles.subtitle}>راجع البيانات قبل الإرسال النهائي</Text>
        </View>

        {/* المعلومات الأساسية */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 المعلومات الأساسية</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.title}:</Text>
            <Text style={styles.value}>{formData.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.propertyType}:</Text>
            <Text style={styles.value}>{formData.propertyType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.price}:</Text>
            <Text style={styles.value}>{formData.price} ريال</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.area}:</Text>
            <Text style={styles.value}>{formData.area} متر مربع</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.buildingDate}:</Text>
            <Text style={styles.value}>{formData.buildingDate}</Text>
          </View>
        </View>

        {/* الصور */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 الصور المرفقة</Text>
          <View style={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: image.uri }} style={styles.image} />
              </View>
            ))}
          </View>
          <Text style={styles.imageCount}>عدد الصور: {images.length}</Text>
        </View>

        {/* تفاصيل الموقع */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 تفاصيل الموقع</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.fullAddress}:</Text>
            <Text style={styles.value}>{formData.fullAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.city}:</Text>
            <Text style={styles.value}>{formData.city}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.governorate}:</Text>
            <Text style={styles.value}>{formData.governorate}</Text>
          </View>
        </View>

        {/* معلومات التواصل */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 معلومات التواصل</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.phone}:</Text>
            <Text style={styles.value}>{formData.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.username}:</Text>
            <Text style={styles.value}>{formData.username}</Text>
          </View>
        </View>

        {/* تفاصيل الإعلان */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 تفاصيل الإعلان</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.adType}:</Text>
            <Text style={styles.value}>{formData.adType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{translate.adStatus}:</Text>
            <Text style={styles.value}>{formData.adStatus}</Text>
          </View>
          <View style={styles.descriptionRow}>
            <Text style={styles.label}>{translate.description}:</Text>
            <Text style={styles.descriptionValue}>{formData.description}</Text>
          </View>
        </View>

        {/* الأزرار */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4D00B1" />
              <Text style={styles.loadingText}>جاري الإرسال...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}> إرسال الإعلان</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}> عودة للتعديل</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  </Layout>
);
}

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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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