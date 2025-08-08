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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { RealEstateDeveloperAdvertisement } from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import Layout from '../src/Layout';

const validationSchema = yup.object().shape({
  developer_name: yup.string().required('اسم المطور مطلوب'),
  description: yup.string().required('وصف المشروع مطلوب'),
  project_types: yup.string().required('نوع المشروع مطلوب'),
  phone: yup.string().required('رقم الهاتف مطلوب'),
  location: yup.string().required('موقع المشروع مطلوب'),
  price_start_from: yup.number().required('السعر من مطلوب').positive('يجب أن يكون السعر موجب'),
  price_end_to: yup.number().required('السعر إلى مطلوب').positive('يجب أن يكون السعر موجب'),
  type_of_user: yup.string().required('نوع المستخدم مطلوب'),
  rooms: yup.number().nullable(),
  bathrooms: yup.number().nullable(),
  floor: yup.number().nullable(),
  furnished: yup.boolean(),
  status: yup.string().required('حالة العقار مطلوبة'),
  paymentMethod: yup.string().nullable(),
  negotiable: yup.boolean(),
  deliveryTerms: yup.string().nullable(),
  area: yup.number().nullable(),
});

const ModernDeveloperForm = ({ navigation, route }) => {
  const [images, setImages] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      developer_name: '',
      description: '',
      project_types: '',
      phone: '',
      location: '',
      price_start_from: '',
      price_end_to: '',
      type_of_user: '',
      rooms: '',
      bathrooms: '',
      floor: '',
      furnished: false,
      status: '',
      paymentMethod: '',
      negotiable: false,
      deliveryTerms: '',
      area: '',
    },
  });

  const watchFurnished = watch('furnished');
  const watchNegotiable = watch('negotiable');

  useEffect(() => {
  }, [navigation, route]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    reset();
    setImages([]);
  };

  const onSubmit = (data) => {

    if (navigation) {
      navigation.navigate('FormStack', {
        screen:'DisplayInfoAddDeveloperAds',
        params:{
     formData: data,
        images: images,
        }
   
      });
    } else {
      Alert.alert('خطأ', 'التنقل غير متوفر، يرجى التحقق من إعدادات التنقل');
    }
  };

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>🏗️ إضافة إعلان مطور عقاري</Text>
            <Text style={styles.subtitle}>
              أضف تفاصيل مشروعك العقاري ليظهر للمستثمرين والعملاء
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 معلومات المطور</Text>

            <Controller
              control={control}
              name="developer_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>اسم المطور *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="أدخل اسم المطور"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textAlign="right"
                    writingDirection="rtl"
                    autoCapitalize="words"
                  />
                  {errors.developer_name && <Text style={styles.errorText}>{errors.developer_name.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="type_of_user"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>نوع المستخدم *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue) => {
                        onChange(itemValue);
                        setValue('type_of_user', itemValue);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="اختر نوع المستخدم" value="" />
                      <Picker.Item label="مطور عقاري" value="مطور عقاري" />
                      <Picker.Item label="شركة تطوير" value="شركة تطوير" />
                      <Picker.Item label="مستثمر" value="مستثمر" />
                    </Picker>
                  </View>
                  {errors.type_of_user && <Text style={styles.errorText}>{errors.type_of_user.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>رقم الهاتف *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="أدخل رقم الهاتف"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                    textAlign="right"
                    writingDirection="rtl"
                  />
                  {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏢 معلومات المشروع</Text>

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>وصف المشروع *</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="أدخل وصف تفصيلي للمشروع"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={4}
                    textAlign="right"
                    textAlignVertical="top"
                    writingDirection="rtl"
                    autoCapitalize="sentences"
                  />
                  {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="project_types"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>نوع المشروع *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue) => {
                        onChange(itemValue);
                        setValue('project_types', itemValue);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="اختر نوع المشروع" value="" />
                      <Picker.Item label="سكني" value="سكني" />
                      <Picker.Item label="تجاري" value="تجاري" />
                      <Picker.Item label="صناعي" value="صناعي" />
                      <Picker.Item label="مختلط" value="مختلط" />
                      <Picker.Item label="فندقي" value="فندقي" />
                      <Picker.Item label="طبي" value="طبي" />
                      <Picker.Item label="تعليمي" value="تعليمي" />
                    </Picker>
                  </View>
                  {errors.project_types && <Text style={styles.errorText}>{errors.project_types.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>موقع المشروع *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="أدخل موقع المشروع"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textAlign="right"
                    writingDirection="rtl"
                    autoCapitalize="sentences"
                  />
                  {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>حالة العقار *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue) => {
                        onChange(itemValue);
                        setValue('status', itemValue);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="اختر حالة العقار" value="" />
                      <Picker.Item label="تحت العرض" value="تحت العرض" />
                      <Picker.Item label="متاح للبيع" value="متاح للبيع" />
                      <Picker.Item label="قيد الإنشاء" value="قيد الإنشاء" />
                      <Picker.Item label="جاهز للتسليم" value="جاهز للتسليم" />
                    </Picker>
                  </View>
                  {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 معلومات الأسعار والدفع</Text>

            <View style={styles.row}>
              <Controller
                control={control}
                name="price_end_to"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>السعر إلى *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="أدخل السعر الأعلى"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      textAlign="right"
                      writingDirection="rtl"
                    />
                    {errors.price_end_to && <Text style={styles.errorText}>{errors.price_end_to.message}</Text>}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="price_start_from"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>السعر من *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="أدخل السعر الأدنى"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      textAlign="right"
                      writingDirection="rtl"
                    />
                    {errors.price_start_from && <Text style={styles.errorText}>{errors.price_start_from.message}</Text>}
                  </View>
                )}
              />
            </View>

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>طريقة الدفع</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue) => {
                        onChange(itemValue);
                        setValue('paymentMethod', itemValue);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="اختر طريقة الدفع" value="" />
                      <Picker.Item label="كاش" value="كاش" />
                      <Picker.Item label="تقسيط" value="تقسيط" />
                      <Picker.Item label="كاش وتقسيط" value="كاش وتقسيط" />
                    </Picker>
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="negotiable"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      onChange(!value);
                      setValue('negotiable', !value);
                    }}
                  >
                    <Text style={styles.checkboxText}>
                      {value ? '☑️' : '⬜'} قابل للتفاوض
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏠 تفاصيل العقار</Text>

            <View style={styles.row}>
              <Controller
                control={control}
                name="bathrooms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>عدد الحمامات</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="عدد الحمامات"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      textAlign="right"
                      writingDirection="rtl"
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name="rooms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>عدد الغرف</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="عدد الغرف"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      textAlign="right"
                      writingDirection="rtl"
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                name="area"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>المساحة (م²)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="المساحة بالمتر المربع"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      textAlign="right"
                      writingDirection="rtl"
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name="floor"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>الطابق</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="رقم الطابق"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                      textAlign="right"
                      writingDirection="rtl"
                    />
                  </View>
                )}
              />
            </View>

            <Controller
              control={control}
              name="furnished"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      onChange(!value);
                      setValue('furnished', !value);
                    }}
                  >
                    <Text style={styles.checkboxText}>
                      {value ? '☑️' : '⬜'} مفروش
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <Controller
              control={control}
              name="deliveryTerms"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>شروط التسليم</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue) => {
                        onChange(itemValue);
                        setValue('deliveryTerms', itemValue);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="اختر شروط التسليم" value="" />
                      <Picker.Item label="فوري" value="فوري" />
                      <Picker.Item label="خلال 3 أشهر" value="خلال 3 أشهر" />
                      <Picker.Item label="خلال 6 أشهر" value="خلال 6 أشهر" />
                      <Picker.Item label="خلال سنة" value="خلال سنة" />
                      <Picker.Item label="خلال سنتين" value="خلال سنتين" />
                    </Picker>
                  </View>
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 صور المشروع</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>📷 إضافة صور</Text>
            </TouchableOpacity>

            {images.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitButtonText}>أضف إعلان المطور</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>إعادة تعيين</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'right',
    writingDirection: 'rtl',
    textAlignVertical: 'center',
  },
  textArea: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'right',
    writingDirection: 'rtl',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 60,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    marginBottom: 15,
  },
  checkbox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    writingDirection: 'rtl',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  uploadButton: {
    backgroundColor: '#4D00B1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  imagePreviewContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4D00B1',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  resetButton: {
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
  resetButtonText: {
    color: '#4D00B1',
    fontSize: 18,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
});

export default ModernDeveloperForm;