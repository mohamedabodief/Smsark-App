import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Layout from '../src/Layout';
import { auth } from '../FireBase/firebaseConfig';

const PACKAGE_INFO = {
  1: { name: 'باقة الأساس', price: 100, duration: 7 },
  2: { name: 'باقة النخبة', price: 150, duration: 14 },
  3: { name: 'باقة التميز', price: 200, duration: 21 },
};

export default function AddFinancingAdFormNative({ navigation }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    org_name: '',
    phone: '',
    start_limit: '',
    end_limit: '',
    interest_rate_upto_5: '',
    interest_rate_upto_10: '',
    interest_rate_above_10: '',
  });
  const [images, setImages] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('الإذن مطلوب', 'يرجى منح الإذن للوصول إلى المعرض');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setImages([...images, ...result.assets]);
    }
  };

  const pickReceiptImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('الإذن مطلوب', 'يرجى منح الإذن للوصول إلى المعرض');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setReceiptImage(result.assets[0]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeReceiptImage = () => {
    setReceiptImage(null);
  };

  const handleSubmit = () => {
    if (!auth.currentUser) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً', [
        { text: 'حسناً', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    const requiredFields = [
      'title',
      'description',
      'org_name',
      'phone',
      'start_limit',
      'end_limit',
      'interest_rate_upto_5',
      'interest_rate_upto_10',
      'interest_rate_above_10',
    ];
    for (let key of requiredFields) {
      if (!form[key].trim()) {
        setError(`من فضلك أدخل ${getFieldLabel(key)}`);
        return;
      }
    }

    const numericFields = [
      'start_limit',
      'end_limit',
      'interest_rate_upto_5',
      'interest_rate_upto_10',
      'interest_rate_above_10',
    ];
    for (let key of numericFields) {
      if (isNaN(parseFloat(form[key])) || parseFloat(form[key]) <= 0) {
        setError(`يجب أن يكون ${getFieldLabel(key)} رقمًا صالحًا أكبر من 0`);
        return;
      }
    }

    if (!selectedPackage) {
      setError('من فضلك اختر باقة');
      return;
    }

    if (!receiptImage) {
      setError('من فضلك ارفع صورة الإيصال');
      return;
    }

    setError(null);
    try {
      navigation.navigate('FormStack', {
        screen: 'DisplayInfoAddFinancingAds',
        params: {
          formData: { ...form, adPackage: selectedPackage },
          images,
          receiptImage,
          userId: auth.currentUser.uid,
        },
      });
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء التنقل إلى صفحة المراجعة');
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

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إضافة إعلان تمويل جديد</Text>
          <Text style={styles.subtitle}>
            قم بملء التفاصيل أدناه لإنشاء إعلان تمويل جديد
          </Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 معلومات الإعلان</Text>
          {[
            { label: 'عنوان الإعلان', key: 'title' },
            { label: 'الوصف', key: 'description', multiline: true },
            { label: 'اسم الجهة', key: 'org_name' },
            { label: 'رقم الهاتف', key: 'phone', keyboardType: 'phone-pad' },
            { label: 'الحد الأدنى (جنيه)', key: 'start_limit', keyboardType: 'numeric' },
            { label: 'الحد الأقصى (جنيه)', key: 'end_limit', keyboardType: 'numeric' },
            {
              label: 'فائدة حتى 5 سنوات (%)',
              key: 'interest_rate_upto_5',
              keyboardType: 'numeric',
            },
            {
              label: 'فائدة حتى 10 سنوات (%)',
              key: 'interest_rate_upto_10',
              keyboardType: 'numeric',
            },
            {
              label: 'فائدة أكثر من 10 سنوات (%)',
              key: 'interest_rate_above_10',
              keyboardType: 'numeric',
            },
          ].map(({ label, key, multiline, keyboardType }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[styles.input, multiline && styles.multilineInput]}
                value={form[key]}
                onChangeText={(text) => handleChange(key, text)}
                multiline={multiline}
                keyboardType={keyboardType}
                textAlign="right"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦اختيارالباقة <TouchableOpacity onPress={()=>{
                           navigation.navigate('MainStack', {
                  screen: 'Payment',
                });
                      }}><Text style={{color:'blue',textDecorationLine:'underline'}}>(تعرف على تفاصيل تحويل قيمة الاعلان المتاحه) </Text></TouchableOpacity></Text>
          <View style={styles.packageContainer}>
            {Object.keys(PACKAGE_INFO).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.packageOption,
                  selectedPackage === key && styles.packageOptionSelected,
                ]}
                onPress={() => setSelectedPackage(key)}
              >
                <Text style={styles.packageText}>
                  {PACKAGE_INFO[key].name} - {PACKAGE_INFO[key].price} جنيه ({PACKAGE_INFO[key].duration} أيام)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedPackage && (
            <View style={styles.packageDetails}>
              <Text style={styles.packageDetailsTitle}>تفاصيل الباقة المختارة</Text>
              <View style={styles.packageDetailsContent}>
                <Text style={styles.packageDetailsText}>
                  الاسم: {PACKAGE_INFO[selectedPackage].name}
                </Text>
                <Text style={styles.packageDetailsText}>
                  السعر: {PACKAGE_INFO[selectedPackage].price} جنيه
                </Text>
                <Text style={styles.packageDetailsText}>
                  المدة: {PACKAGE_INFO[selectedPackage].duration} أيام
                </Text>
                <View style={styles.receiptSection}>
                  <Text style={styles.receiptTitle}>🧾 صورة الإيصال</Text>
                  <TouchableOpacity style={styles.imageButton} onPress={pickReceiptImage}>
                    <Text style={styles.imageButtonText}>رفع صورة الإيصال</Text>
                  </TouchableOpacity>
                  {receiptImage && (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: receiptImage.uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={removeReceiptImage}
                      >
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 صور الإعلان</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>إضافة صور</Text>
          </TouchableOpacity>
          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>مراجعة الإعلان</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingBottom: 20,
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    marginBottom: 6,
    writingDirection: 'rtl',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    textAlign: 'right',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  packageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  packageOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  packageOptionSelected: {
    borderColor: '#4D00B1',
    backgroundColor: '#e6d9ff',
  },
  packageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  packageDetails: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#4D00B1',
  },
  packageDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4D00B1',
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  packageDetailsContent: {
    alignItems: 'flex-end',
  },
  packageDetailsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  receiptSection: {
    marginTop: 15,
    margin:'auto'
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    marginBottom: 10,
    writingDirection: 'rtl',
  },
  imageButton: {
    backgroundColor: '#4D00B1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 10,
    marginHorizontal: 20,
    writingDirection: 'rtl',
  },
});