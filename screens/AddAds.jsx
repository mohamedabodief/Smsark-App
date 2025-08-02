import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Layout from '../src/Layout';

const validationSchema = yup.object().shape({
  title: yup.string().required('عنوان الإعلان مطلوب'),
  propertyType: yup.string().required('نوع العقار مطلوب'),
  price: yup.number().positive('السعر يجب أن يكون رقمًا موجباً').required('السعر مطلوب'),
  area: yup.number().positive('المساحة يجب أن تكون رقمًا موجباً').required('المساحة مطلوبة'),
  buildingDate: yup.string().required('تاريخ البناء مطلوب'),
  fullAddress: yup.string().required('العنوان الكامل مطلوب'),
  city: yup.string().required('المدينة مطلوبة'),
  governorate: yup.string().required('المحافظة مطلوبة'),
  phone: yup.string().required('رقم الهاتف مطلوب'),
  username: yup.string().required('اسم المستخدم مطلوب'),
  adType: yup.string().required('نوع الإعلان مطلوب'),
  adStatus: yup.string().required('حالة الإعلان مطلوبة'),
  description: yup.string().required('الوصف مطلوب'),
});

const pickImages = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('الإذن مرفوض', 'نحتاج إلى إذن للوصول إلى المعرض لاختيار الصور.');
      throw new Error('الإذن للوصول إلى المعرض مرفوض');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 4, // تحديد الحد الأقصى للصور
      quality: 0.5,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      throw new Error('تم إلغاء اختيار الصور');
    }

    const images = result.assets.map((asset) => ({ uri: asset.uri }));
    console.log('Picked images:', images);
    return images;
  } catch (error) {
    console.error('Pick Images Error:', error);
    throw error;
  }
};

const AddAds = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log('AddAds component mounted');
    console.log('navigation prop:', navigation);
    console.log('route prop:', route);
  }, [navigation, route]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      propertyType: '',
      price: '',
      area: '',
      buildingDate: '',
      fullAddress: '',
      city: '',
      governorate: '',
      phone: '',
      username: '',
      adType: '',
      adStatus: '',
      description: '',
    },
  });

  const handleImageUpload = async () => {
    try {
      setImageError('');
      setUploading(true);
      const pickedImages = await pickImages();
      if (pickedImages.length > 0) {
        // إضافة الصور الجديدة مع التأكد من عدم التجاوز للحد الأقصى (4 صور)
        const newImages = [...images, ...pickedImages].slice(0, 4);
        setImages(newImages);
        console.log('Images updated:', newImages.map((img) => img.uri));
      }
    } catch (error) {
      setImageError(`فشل اختيار الصور: ${error.message}`);
      console.error('Image picker error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    setUploading(true);

    if (images.length === 0) {
      setSubmitError('يرجى اختيار صورة واحدة على الأقل');
      setUploading(false);
      return;
    }

    if (!navigation) {
      setSubmitError('خطأ في التنقل. يرجى المحاولة مرة أخرى.');
      setUploading(false);
      return;
    }

    try {
      console.log('Navigating with images:', images.map((img) => img.uri));
      navigation.navigate('FormStack', {
        screen: 'DisplayInfoAddClientAds',
        params: {
          formData: { ...data },
          images,
        },
      });
    } catch (error) {
      setSubmitError(`فشل إرسال النموذج: ${error.message}`);
      console.error('Submit error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    reset();
    setImages([]);
    setImageError('');
    setSubmitError('');
  };

  const propertyTypes = ['شقة', 'فيلا', 'مكتب', 'محل تجاري', 'أرض', 'مزرعة'];
  const adTypes = ['بيع', 'إيجار'];
  const adStatuses = ['تحت العرض', 'منتهي', 'تحت التفاوض'];

  return (
    <Layout>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>إضافة إعلان عقاري</Text>
            <Text style={styles.subtitle}>أضف تفاصيل عقارك وابدأ في التواصل مع العملاء المحتملين</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 المعلومات الأساسية</Text>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>عنوان الإعلان</Text>
                  <TextInput
                    {...field}
                    style={[styles.input, errors.title && styles.inputError]}
                    placeholder="اكتب عنوان الإعلان هنا"
                    placeholderTextColor="#999"
                    textAlign="right"
                    onChangeText={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                    autoCapitalize="sentences"
                  />
                  {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
                </View>
              )}
            />
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>نوع العقار</Text>
                  <View style={[styles.pickerContainer, errors.propertyType && styles.inputError]}>
                    <Picker
                      selectedValue={field.value}
                      onValueChange={field.onChange}
                      style={styles.picker}
                    >
                      <Picker.Item label="اختر نوع العقار" value="" enabled={false} />
                      {propertyTypes.map((type) => (
                        <Picker.Item key={type} label={type} value={type} />
                      ))}
                    </Picker>
                  </View>
                  {errors.propertyType && <Text style={styles.errorText}>{errors.propertyType.message}</Text>}
                </View>
              )}
            />
            <View style={styles.row}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>السعر</Text>
                    <TextInput
                      {...field}
                      style={[styles.input, errors.price && styles.inputError]}
                      placeholder="أدخل السعر"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      textAlign="right"
                      onChangeText={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                    />
                    {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
                  </View>
                )}
              />
              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>المساحة</Text>
                    <TextInput
                      {...field}
                      style={[styles.input, errors.area && styles.inputError]}
                      placeholder="أدخل المساحة"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      textAlign="right"
                      onChangeText={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                    />
                    {errors.area && <Text style={styles.errorText}>{errors.area.message}</Text>}
                  </View>
                )}
              />
            </View>
            <Controller
              name="buildingDate"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>تاريخ البناء</Text>
                  <TextInput
                    {...field}
                    keyboardType="phone-pad"
                    style={[styles.input, errors.buildingDate && styles.inputError]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                    textAlign="right"
                    onChangeText={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                  />
                  {errors.buildingDate && <Text style={styles.errorText}>{errors.buildingDate.message}</Text>}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 الصور</Text>
            <TouchableOpacity
              style={[styles.uploadButton, images.length >= 4 && styles.disabledButton]}
              onPress={handleImageUpload}
              disabled={uploading || images.length >= 4}
            >
              <Text style={styles.uploadButtonText}>📁 رفع الصور (1-4 صور)</Text>
            </TouchableOpacity>
            {imageError && <Text style={styles.errorText}>{imageError}</Text>}
            {images.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {images.map((img, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: img.uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>✖</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {images.length > 0 && (
              <Text style={styles.imageCount}>تم إضافة {images.length} صورة</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 تفاصيل الموقع</Text>
            <Controller
              name="fullAddress"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>العنوان التفصيلي</Text>
                  <TextInput
                    {...field}
                    style={[styles.input, errors.fullAddress && styles.inputError]}
                    placeholder="اكتب العنوان الكامل"
                    placeholderTextColor="#999"
                    textAlign="right"
                    onChangeText={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                    autoCapitalize="sentences"
                  />
                  {errors.fullAddress && <Text style={styles.errorText}>{errors.fullAddress.message}</Text>}
                </View>
              )}
            />
            <View style={styles.row}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>المدينة</Text>
                    <TextInput
                      {...field}
                      style={[styles.input, errors.city && styles.inputError]}
                      placeholder="اكتب اسم المدينة"
                      placeholderTextColor="#999"
                      textAlign="right"
                      onChangeText={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      autoCapitalize="words"
                    />
                    {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
                  </View>
                )}
              />
              <Controller
                name="governorate"
                control={control}
                render={({ field }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>المحافظة</Text>
                    <TextInput
                      {...field}
                      style={[styles.input, errors.governorate && styles.inputError]}
                      placeholder="اكتب اسم المحافظة"
                      placeholderTextColor="#999"
                      textAlign="right"
                      onChangeText={field.onChange}
                      value={field.value}
                      onBlur={field.onBlur}
                      autoCapitalize="words"
                    />
                    {errors.governorate && <Text style={styles.errorText}>{errors.governorate.message}</Text>}
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📞 معلومات التواصل</Text>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>رقم الهاتف</Text>
                  <TextInput
                    {...field}
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="أدخل رقم الهاتف"
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                    textAlign="right"
                    onChangeText={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                  />
                  {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                </View>
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>اسم المستخدم</Text>
                  <TextInput
                    {...field}
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="أدخل اسم المستخدم"
                    placeholderTextColor="#999"
                    textAlign="right"
                    onChangeText={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                    autoCapitalize="words"
                  />
                  {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 تفاصيل الإعلان</Text>
            <View style={styles.row}>
              <Controller
                name="adType"
                control={control}
                render={({ field }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>نوع الإعلان</Text>
                    <View style={[styles.pickerContainer, errors.adType && styles.inputError]}>
                      <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        style={styles.picker}
                      >
                        <Picker.Item label="اختر نوع الإعلان" value="" enabled={false} />
                        {adTypes.map((type) => (
                          <Picker.Item key={type} label={type} value={type} />
                        ))}
                      </Picker>
                    </View>
                    {errors.adType && <Text style={styles.errorText}>{errors.adType.message}</Text>}
                  </View>
                )}
              />
              <Controller
                name="adStatus"
                control={control}
                render={({ field }) => (
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>حالة الإعلان</Text>
                    <View style={[styles.pickerContainer, errors.adStatus && styles.inputError]}>
                      <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        style={styles.picker}
                      >
                        <Picker.Item label="اختر حالة الإعلان" value="" enabled={false} />
                        {adStatuses.map((status) => (
                          <Picker.Item key={status} label={status} value={status} />
                        ))}
                      </Picker>
                    </View>
                    {errors.adStatus && <Text style={styles.errorText}>{errors.adStatus.message}</Text>}
                  </View>
                )}
              />
            </View>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>الوصف</Text>
                  <TextInput
                    {...field}
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                    placeholder="اكتب وصف مفصل للعقار"
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#999"
                    textAlign="right"
                    textAlignVertical="top"
                    onChangeText={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                    autoCapitalize="sentences"
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
                </View>
              )}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, uploading && { opacity: 0.6 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={uploading}
            >
              <Text style={styles.submitButtonText}>✅ أضف الإعلان</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resetButton, uploading && { opacity: 0.6 }]}
              onPress={handleReset}
              disabled={uploading}
            >
              <Text style={styles.resetButtonText}>🔄 إعادة تعيين</Text>
            </TouchableOpacity>
          </View>

          {submitError && <Text style={styles.errorText}>{submitError}</Text>}
          {uploading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4D00B1" />
              <Text style={styles.loadingText}>جاري معالجة النموذج...</Text>
            </View>
          )}
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlign: 'right',
    color: '#333',
    writingDirection: 'rtl',
    textAlignVertical: 'center',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    writingDirection: 'rtl',
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 6,
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  uploadButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imagePreview: {
    position: 'relative',
    width: 100,
    height: 100,
    marginLeft: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageCount: {
    color: '#28a745',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '500',
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
  resetButton: {
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
  },
  resetButtonText: {
    color: '#4D00B1',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
});

export default AddAds;