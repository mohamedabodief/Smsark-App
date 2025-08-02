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
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import { auth, db } from '../FireBase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const DisplayInfoAddFinancingAds = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { formData, images } = route.params || {};
  const userId = auth.currentUser?.uid;
  const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150?text=Default+Financing+Image';

  useEffect(() => {
    console.log('FinancingAdvertisement:', FinancingAdvertisement);
    console.log('Form Data:', formData);
    console.log('Images:', images);
    console.log('UserId:', userId);

    if (!formData) {
      Alert.alert('خطأ', 'لم يتم العثور على بيانات الإعلان', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    if (!userId) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً', [
        { text: 'حسناً', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (!formData.title && !formData.description && !images?.length) {
      Alert.alert('خطأ', 'البيانات أو الصورة غير متوفرة', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }
  }, [formData, images, userId, navigation]);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting handleSubmit with userId:', userId);

      // تحديث نوع المستخدم في Firestore
      await setDoc(
        doc(db, 'users', userId),
        {
          uid: userId,
          userType: 'organization',
        },
        { merge: true }
      );
      console.log('User type updated to organization for UID:', userId);

      // تحويل الصور إلى كائنات File
      let imageFiles = [];
      if (images && images.length > 0) {
        imageFiles = await Promise.all(
          images.map(async (image, index) => {
            try {
              console.log('Fetching image URI:', image.uri);
              const response = await fetch(image.uri);
              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${image.uri}`);
              }
              const blob = await response.blob();
              return new File([blob], `image_${index + 1}.jpg`, { type: 'image/jpeg' });
            } catch (error) {
              console.error('Error converting image:', error);
              return null;
            }
          })
        ).then(files => files.filter(file => file !== null));
      }
      if (imageFiles.length === 0) {
        console.log('No valid images, using default image');
        imageFiles = [DEFAULT_IMAGE_URL];
      }

      console.log('Image Files (sent to Firestore):', imageFiles);

      // إعداد بيانات الإعلان
      const adData = {
        userId: userId,
        title: formData.title || '',
        description: formData.description || '',
        org_name: formData.org_name || '',
        phone: formData.phone || '',
        start_limit: formData.start_limit ? parseFloat(formData.start_limit) : null,
        end_limit: formData.end_limit ? parseFloat(formData.end_limit) : null,
        interest_rate_upto_5: formData.interest_rate_upto_5 ? parseFloat(formData.interest_rate_upto_5) : null,
        interest_rate_upto_10: formData.interest_rate_upto_10 ? parseFloat(formData.interest_rate_upto_10) : null,
        interest_rate_above_10: formData.interest_rate_above_10 ? parseFloat(formData.interest_rate_above_10) : null,
        images: [], // سيتم تحديثها بواسطة FinancingAdvertisement.save
        reviewStatus: 'pending',
        ads: false,
        adExpiryTime: null,
        receipt_image: null,
        reviewed_by: null,
        review_note: null,
        adPackage: null,
      };

      console.log('Ad Data prepared:', adData);

      // إنشاء كائن FinancingAdvertisement وحفظ الإعلان
      console.log('Creating FinancingAdvertisement instance');
      const financingAd = new FinancingAdvertisement(adData);
      console.log('Calling save method with imageFiles:', imageFiles);
      const docId = await financingAd.save(imageFiles);
      console.log('Advertisement saved with docId:', docId);

      Alert.alert(
        'تم الإرسال بنجاح',
        `تم إرسال إعلان التمويل بنجاح، معرف المستند: ${docId}`,
        [
          {
            text: 'حسناً',
            onPress: () =>
              navigation.navigate('MainDrawer', {
                screen: 'MyAds',
                params: { newAd: true },
              }),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving financing ad:', error);
      Alert.alert('خطأ', `حدث خطأ أثناء حفظ الإعلان: ${error.message || 'يرجى المحاولة مرة أخرى'}`);
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      title: 'عنوان الإعلان',
      description: 'الوصف',
      org_name: 'اسم الجهة',
      phone: 'رقم الهاتف',
      start_limit: 'الحد الأدنى (جنيه)',
      end_limit: 'الحد الأقصى (جنيه)',
      interest_rate_upto_5: 'فائدة حتى 5 سنوات (%)',
      interest_rate_upto_10: 'فائدة حتى 10 سنوات (%)',
      interest_rate_above_10: 'فائدة أكثر من 10 سنوات (%)',
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
          <Text style={styles.title}>مراجعة إعلان التمويل</Text>
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
                  <Text style={styles.value}>{value}</Text>
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

export default DisplayInfoAddFinancingAds;