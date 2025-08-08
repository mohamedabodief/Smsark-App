import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { auth, db } from '../FireBase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const DisplayInfoAddDeveloperAds = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { formData, images } = route.params || {};
  const userId = auth.currentUser?.uid;
  const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150?text=Default+Developer+Image';

  useEffect(() => {
 

    if (!formData) {
      navigation.goBack();
      return;
    }

    if (!userId) {
      navigation.navigate('Login');
      return;
    }

    if (!formData.developer_name && !formData.description && !images?.length) {
      navigation.goBack();
    }
  }, [formData, images, userId, navigation]);

  const handleSubmit = async () => {
    if (!userId) {
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      await setDoc(
        doc(db, 'users', userId),
        {
          uid: userId,
          userType: 'organization',
        },
        { merge: true }
      );

      let imageFiles = [];
      if (images && images.length > 0) {
        imageFiles = await Promise.all(
          images.map(async (image, index) => {
            try {
              const response = await fetch(image.uri);
              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${image.uri}`);
              }
              const blob = await response.blob();
              return new File([blob], `image_${index + 1}.jpg`, { type: 'image/jpeg' });
            } catch (error) {
           
              return null;
            }
          })
        ).then(files => files.filter(file => file !== null));
      }

      if (imageFiles.length === 0) {
        imageFiles = [DEFAULT_IMAGE_URL];
      }


      // توافق الحقول مع RealEstateDeveloperAdvertisement
      const adData = {
        userId: userId,
        developer_name: formData.developer_name || '',
        description: formData.description || '',
        project_types: formData.project_types || '',
        phone: formData.phone || '',
        location: formData.location || '',
        price_start_from: formData.price_start_from ? parseFloat(formData.price_start_from) : 0,
        price_end_to: formData.price_end_to ? parseFloat(formData.price_end_to) : 0,
        type_of_user: formData.type_of_user || 'organization',
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        furnished: formData.furnished || false,
        status: formData.status || 'تحت العرض',
        paymentMethod: formData.paymentMethod || null,
        negotiable: formData.negotiable || false,
        deliveryTerms: formData.deliveryTerms || null,
        features: formData.features || [],
        area: formData.area ? parseFloat(formData.area) : null,
        reviewStatus: 'pending',
        ads: false,
        adExpiryTime: null,
        receipt_image: null,
        reviewed_by: null,
        review_note: null,
        adPackage: null,
        images: imageFiles.map(file => typeof file === 'string' ? file : file.name || DEFAULT_IMAGE_URL),
      };
      const developerAd = new RealEstateDeveloperAdvertisement(adData);
      const docId = await developerAd.save(imageFiles);
    Alert.alert(
              'نجح الإرسال',
              'تم رفع إعلانك وهو الآن قيد المراجعة',
              [{ text: 'حسناً', onPress: () => navigation.navigate('MyAds') }]
            );
    } catch (error) {
      navigation.navigate('MyAds');
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      developer_name: 'اسم المطور',
      description: 'الوصف',
      project_types: 'نوع المشروع',
      phone: 'رقم الهاتف',
      location: 'موقع المشروع',
      price_start_from: 'السعر من (جنيه)',
      price_end_to: 'السعر إلى (جنيه)',
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

  if (!formData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>لا توجد بيانات لعرضها</Text>
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
          <Text style={styles.sectionTitle}>📋 معلومات الإعلان</Text>
          {Object.keys(formData).length === 0 ? (
            <Text style={styles.errorText}>لا توجد بيانات إعلان لعرضها</Text>
          ) : (
            Object.entries(formData).map(([key, value]) => {
              if (value === '' || value === null || value === undefined) {
                return null;
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
                  <Text style={styles.value}>{value.toString()}</Text>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 صور الإعلان</Text>
          <Text style={styles.imageCount}>
            عدد الصور: {(images && images.length > 0) ? images.length : 1}
          </Text>
          <View style={styles.imagePreviewContainer}>
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                  onError={(e) => console.log(`Image load error for ${image.uri}:`, e.nativeEvent.error)}
                />
              ))
            ) : (
              <Image
                source={{ uri: DEFAULT_IMAGE_URL }}
                style={styles.imagePreview}
              />
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>إرسال الإعلان</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
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
    shadowOffset: { width: 0, height: 2 },
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
    marginTop: 20,
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
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#a4a4a4',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4D00B1',
    marginBottom: 20,
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
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
    writingDirection: 'rtl',
  },
});

export default DisplayInfoAddDeveloperAds;