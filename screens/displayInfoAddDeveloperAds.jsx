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
import { RealEstateDeveloperAdvertisement } from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { auth } from '../FireBase/firebaseConfig';
import { storage } from '../FireBase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DisplayInfoAddDeveloperAds = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { formData, images } = route.params || {};

  useEffect(() => {
    console.log('Form Data:', formData);
    console.log('Images:', images);
    
    if (!formData || !images) {
      Alert.alert('خطأ', 'لم يتم العثور على بيانات الإعلان', [
        { text: 'حسناً', onPress: () => navigation.goBack() }
      ]);
    }
  }, [formData, images, navigation]);

  const uploadImagesAndGetUrls = async (imageFiles) => {
    const urls = [];
    for (const image of imageFiles) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const filename = `developer_ads/${Date.now()}_${Math.random()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let imageUrls = [];
      if (images && images.length > 0) {
        imageUrls = await uploadImagesAndGetUrls(images);
      }

      const developerAd = new RealEstateDeveloperAdvertisement({
        developer_name: formData.developer_name,
        description: formData.description,
        project_types: formData.project_types,
        phone: formData.phone,
        location: formData.location,
        price_start_from: parseFloat(formData.price_start_from),
        price_end_to: parseFloat(formData.price_end_to),
        type_of_user: formData.type_of_user,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        furnished: formData.furnished || false,
        status: formData.status,
        paymentMethod: formData.paymentMethod || null,
        negotiable: formData.negotiable || false,
        deliveryTerms: formData.deliveryTerms || null,
        area: formData.area ? parseFloat(formData.area) : null,
        images: imageUrls,
        userId: auth.currentUser?.uid || 'anonymous',
        reviewStatus: 'pending',
      });

      await developerAd.save();
      
      Alert.alert(
        'تم الإرسال بنجاح',
        'تم إرسال إعلان المطور بنجاح وسيتم مراجعته قريباً',
        [
          {
            text: 'حسناً',
            onPress: () => navigation.navigate('AddDeveloperAds')
          }
        ]
      );
    } catch (error) {
      console.error('Error saving developer ad:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الإعلان، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      developer_name: 'اسم المطور',
      description: 'وصف المشروع',
      project_types: 'نوع المشروع',
      phone: 'رقم الهاتف',
      location: 'موقع المشروع',
      price_start_from: 'السعر من',
      price_end_to: 'السعر إلى',
      type_of_user: 'نوع المستخدم',
      rooms: 'عدد الغرف',
      bathrooms: 'عدد الحمامات',
      floor: 'الطابق',
      furnished: 'مفروش',
      status: 'حالة العقار',
      paymentMethod: 'طريقة الدفع',
      negotiable: 'قابل للتفاوض',
      deliveryTerms: 'شروط التسليم',
      area: 'المساحة (م²)',
    };
    return labels[key] || key;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4D00B1" />
          <Text style={styles.loadingText}>جاري إرسال الإعلان...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>مراجعة إعلان المطور</Text>
          <Text style={styles.subtitle}>
            راجع بيانات إعلانك قبل الإرسال النهائي
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 معلومات المشروع</Text>
          
          {Object.entries(formData).map(([key, value]) => {
            // تجاهل الحقول الفارغة
            if (value === '' || value === null || value === undefined) {
              return null;
            }

            // التعامل مع القيم البولينية
            if (typeof value === 'boolean') {
              return (
                <View key={key} style={styles.row}>
                  <Text style={styles.label}>{getFieldLabel(key)}</Text>
                  <Text style={styles.value}>{value ? 'نعم' : 'لا'}</Text>
                </View>
              );
            }

            if (key === 'description') {
              return (
                <View key={key} style={styles.descriptionRow}>
                  <Text style={styles.label}>{getFieldLabel(key)}</Text>
                  <Text style={styles.descriptionValue}>{value}</Text>
                </View>
              );
            }
            
            return (
              <View key={key} style={styles.row}>
                <Text style={styles.label}>{getFieldLabel(key)}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            );
          })}
        </View>

        {images && images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 صور المشروع</Text>
            <Text style={styles.imageCount}>عدد الصور: {images.length}</Text>
            <View style={styles.imagePreviewContainer}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>إرسال الإعلان</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>عودة للتعديل</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
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
    marginHorizontal: 20,
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
    marginHorizontal: 20,
    marginBottom: 30,
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
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4D00B1',
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

export default DisplayInfoAddDeveloperAds; 