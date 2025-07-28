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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
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
  const [uploading, setUploading] = useState(false);
  const [projectTypesOpen, setProjectTypesOpen] = useState(false);
  const [projectTypesValue, setProjectTypesValue] = useState(null);
  const [projectTypesItems, setProjectTypesItems] = useState([
    { label: 'سكني', value: 'سكني' },
    { label: 'تجاري', value: 'تجاري' },
    { label: 'صناعي', value: 'صناعي' },
    { label: 'مختلط', value: 'مختلط' },
    { label: 'فندقي', value: 'فندقي' },
    { label: 'طبي', value: 'طبي' },
    { label: 'تعليمي', value: 'تعليمي' },
  ]);

  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userTypeValue, setUserTypeValue] = useState(null);
  const [userTypeItems, setUserTypeItems] = useState([
    { label: 'مطور عقاري', value: 'مطور عقاري' },
    { label: 'شركة تطوير', value: 'شركة تطوير' },
    { label: 'مستثمر', value: 'مستثمر' },
  ]);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(null);
  const [statusItems, setStatusItems] = useState([
    { label: 'تحت العرض', value: 'تحت العرض' },
    { label: 'متاح للبيع', value: 'متاح للبيع' },
    { label: 'قيد الإنشاء', value: 'قيد الإنشاء' },
    { label: 'جاهز للتسليم', value: 'جاهز للتسليم' },
  ]);

  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [paymentMethodValue, setPaymentMethodValue] = useState(null);
  const [paymentMethodItems, setPaymentMethodItems] = useState([
    { label: 'كاش', value: 'كاش' },
    { label: 'تقسيط', value: 'تقسيط' },
    { label: 'كاش وتقسيط', value: 'كاش وتقسيط' },
  ]);

  const [deliveryTermsOpen, setDeliveryTermsOpen] = useState(false);
  const [deliveryTermsValue, setDeliveryTermsValue] = useState(null);
  const [deliveryTermsItems, setDeliveryTermsItems] = useState([
    { label: 'فوري', value: 'فوري' },
    { label: 'خلال 3 أشهر', value: 'خلال 3 أشهر' },
    { label: 'خلال 6 أشهر', value: 'خلال 6 أشهر' },
    { label: 'خلال سنة', value: 'خلال سنة' },
    { label: 'خلال سنتين', value: 'خلال سنتين' },
  ]);

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
    console.log('Navigation:', navigation);
    console.log('Route:', route);
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

  const onSubmit = (data) => {
    console.log('Form data:', data);
    console.log('Images:', images);
    
    if (navigation) {
      navigation.navigate('DisplayInfoAddDeveloperAds', {
        formData: data,
        images: images,
      });
    } else {
      console.log('Navigation is not available');
    }
  };

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
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
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>نوع المستخدم *</Text>
                <DropDownPicker
                  open={userTypeOpen}
                  value={userTypeValue}
                  items={userTypeItems}
                  setOpen={setUserTypeOpen}
                  setValue={setUserTypeValue}
                  setItems={setUserTypeItems}
                  placeholder="اختر نوع المستخدم"
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  onSelectItem={(item) => {
                    onChange(item.value);
                    setValue('type_of_user', item.value);
                  }}
                  zIndex={4000}
                  zIndexInverse={1000}
                />
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
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>نوع المشروع *</Text>
                <DropDownPicker
                  open={projectTypesOpen}
                  value={projectTypesValue}
                  items={projectTypesItems}
                  setOpen={setProjectTypesOpen}
                  setValue={setProjectTypesValue}
                  setItems={setProjectTypesItems}
                  placeholder="اختر نوع المشروع"
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  onSelectItem={(item) => {
                    onChange(item.value);
                    setValue('project_types', item.value);
                  }}
                  zIndex={3000}
                  zIndexInverse={2000}
                />
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
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>حالة العقار *</Text>
                <DropDownPicker
                  open={statusOpen}
                  value={statusValue}
                  items={statusItems}
                  setOpen={setStatusOpen}
                  setValue={setStatusValue}
                  setItems={setStatusItems}
                  placeholder="اختر حالة العقار"
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  onSelectItem={(item) => {
                    onChange(item.value);
                    setValue('status', item.value);
                  }}
                  zIndex={2000}
                  zIndexInverse={3000}
                />
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
          </View>

          <Controller
            control={control}
            name="paymentMethod"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>طريقة الدفع</Text>
                <DropDownPicker
                  open={paymentMethodOpen}
                  value={paymentMethodValue}
                  items={paymentMethodItems}
                  setOpen={setPaymentMethodOpen}
                  setValue={setPaymentMethodValue}
                  setItems={setPaymentMethodItems}
                  placeholder="اختر طريقة الدفع"
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  onSelectItem={(item) => {
                    onChange(item.value);
                    setValue('paymentMethod', item.value);
                  }}
                  zIndex={1000}
                  zIndexInverse={4000}
                />
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
          </View>

          <View style={styles.row}>
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
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>شروط التسليم</Text>
                <DropDownPicker
                  open={deliveryTermsOpen}
                  value={deliveryTermsValue}
                  items={deliveryTermsItems}
                  setOpen={setDeliveryTermsOpen}
                  setValue={setDeliveryTermsValue}
                  setItems={setDeliveryTermsItems}
                  placeholder="اختر شروط التسليم"
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  onSelectItem={(item) => {
                    onChange(item.value);
                    setValue('deliveryTerms', item.value);
                  }}
                  zIndex={500}
                  zIndexInverse={4500}
                />
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
        </View>
      </ScrollView>
    </SafeAreaView>
    </Layout>
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
  dropdown: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dropdownPlaceholder: {
    color: '#999',
    textAlign: 'right',
    writingDirection: 'rtl',
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
    backgroundColor: '#dc3545',
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
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
});

export default ModernDeveloperForm;