import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import User from '../../FireBase/modelsWithOperations/User';
import { auth, storage } from '../../FireBase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function OrganizationDetailsScreen({ route }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const uid = route.params?.uid || (user && user.uid) || 'guest';
  const [org_name, setOrgName] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [type_of_organization, setType] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({
    org_name: '',
    phone: '',
    type_of_organization: '',
    governorate: '',
    city: '',
    address: '',
    images: '',
  });
  const organizationTypes = [
    { label: 'اختر نوع المنظمة', value: '' },
    { label: 'ممول عقارى', value: 'ممول عقارى' },
    { label: 'مطور عقارى', value: 'مطور عقارى' },
  ];
  const pickImage = async () => {
    if (images.length >= 2) {
      Alert.alert('خطأ', 'يمكنك رفع صورتين فقط كحد أقصى');
      return;
    }
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('خطأ', 'تحتاج إلى منح إذن للوصول إلى المعرض');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0];
      setImages([...images, newImage]);
      setErrors({ ...errors, images: '' }); 
    }
  };

  const deleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setErrors({
      ...errors,
      images: updatedImages.length >= 1 ? '' : 'يجب رفع صورة واحدة على الأقل',
    });
  };
  const validateForm = () => {
    const newErrors = {
      org_name: org_name.trim() ? '' : 'اسم المنظمة مطلوب',
      phone: phone.trim() ? '' : 'رقم الهاتف مطلوب',
      type_of_organization: type_of_organization.trim() ? '' : 'نوع المنظمة مطلوب',
      governorate: governorate.trim() ? '' : 'المحافظة مطلوبة',
      city: city.trim() ? '' : 'المدينة أو القرية مطلوبة',
      address: address.trim() ? '' : 'العنوان بالتفصيل مطلوب',
      images: images.length >= 1 ? '' : 'يجب رفع صورة واحدة على الأقل',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const allFieldsFilled =
    org_name.trim() &&
    phone.trim() &&
    type_of_organization.trim() &&
    governorate.trim() &&
    city.trim() &&
    address.trim() &&
    images.length >= 1;

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة ورفع صورة واحدة على الأقل');
      return;
    }

    if (uid === 'guest') {
      Alert.alert('خطأ', 'معرف المستخدم غير متاح. يرجى تسجيل الدخول مرة أخرى.');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
      return;
    }

    try {
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `tax_card_${uid}_${Date.now()}_${i}.jpg`;
        const storageRef = ref(storage, `property_images/${uid}/${fileName}`);
        const response = await fetch(image.uri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }
      const userData = new User({
        uid,
        type_of_user: 'organization',
        org_name,
        phone,
        type_of_organization,
        governorate,
        city,
        address,
        tax_card_images: imageUrls, 
        profile_completed: true,
        created_at: new Date().toISOString(),
      });

      await userData.saveToFirestore();
      Alert.alert('تم', 'تم حفظ البيانات بنجاح', [
        {
          text: 'موافق',
          onPress: () => {
          navigation.navigate('MainApp', { screen: 'MainStack', params: { screen: 'Home' } })
          },
        },
      ]);
    } catch (err) {
      Alert.alert('خطأ', err.message);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg-sign.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: '#6E00FE', marginBottom: 20 }}>
            إنشاء حساب جديد
          </Text>
          <Text style={styles.label}>اسم المنظمة *</Text>
          <TextInput
            placeholder="اسم المنظمة"
            value={org_name}
            onChangeText={setOrgName}
            style={[styles.input, errors.org_name ? styles.inputError : null]}
          />
          {errors.org_name ? <Text style={styles.errorText}>{errors.org_name}</Text> : null}

          <Text style={styles.label}>رقم الهاتف *</Text>
          <TextInput
            placeholder="رقم الهاتف"
            value={phone}
            onChangeText={setPhoneNumber}
            style={[styles.input, errors.phone ? styles.inputError : null]}
            keyboardType="phone-pad"
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <Text style={styles.label}>نوع المنظمة *</Text>
          <View style={[styles.pickerContainer, errors.type_of_organization ? styles.inputError : null]}>
            <Picker
              selectedValue={type_of_organization}
              onValueChange={(itemValue) => setType(itemValue)}
              style={styles.picker}
              itemStyle={{ color: '#000', fontSize: 16, marginTop: -20 }}
            >
              {organizationTypes.map((type) => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>
          </View>
          {errors.type_of_organization ? (
            <Text style={styles.errorText}>{errors.type_of_organization}</Text>
          ) : null}

          <Text style={styles.label}>المحافظة *</Text>
          <TextInput
            placeholder="المحافظة"
            value={governorate}
            onChangeText={setGovernorate}
            style={[styles.input, errors.governorate ? styles.inputError : null]}
          />
          {errors.governorate ? <Text style={styles.errorText}>{errors.governorate}</Text> : null}

          <Text style={styles.label}>المدينة / القرية *</Text>
          <TextInput
            placeholder="المدينة أو القرية"
            value={city}
            onChangeText={setCity}
            style={[styles.input, errors.city ? styles.inputError : null]}
          />
          {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

          <Text style={styles.label}>العنوان بالتفصيل *</Text>
          <TextInput
            placeholder="العنوان بالتفصيل"
            value={address}
            onChangeText={setAddress}
            style={[styles.input, errors.address ? styles.inputError : null]}
          />
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

          <Text style={styles.label}>صورة البطاقة الضريبية * (حد أدنى 1، حد أقصى 2)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>اختر صورة</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImage(index)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {errors.images ? <Text style={styles.errorText}>{errors.images}</Text> : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>رجوع</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: allFieldsFilled ? '#6E00FE' : '#ccc' },
              ]}
              onPress={handleSave}
              disabled={!allFieldsFilled}
            >
              <Text style={styles.submitButtonText}>إنهاء التسجيل</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
   
    marginTop:30
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
     marginBottom:80,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#6E00FE',
    direction: 'rtl',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6E00FE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#6E00FE',
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 5,
    paddingBottom: 55,
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  backButton: {
    backgroundColor: '#aaa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#6E00FE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});