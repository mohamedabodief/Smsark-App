// AddAdvDev.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useWindowDimensions,
  I18nManager
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Layout from '../../Layout';

I18nManager.forceRTL(true); // للتأكد من الاتجاه

const AddAdvDev = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const isEditMode = route.params?.editMode || false;
  const editData = route.params?.adData || {};

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      projectName: editData.projectName ?? '',
      propertyType: editData.propertyType ?? 'شقق للبيع',
      price: editData.price?.toString() ?? '',
      city: editData.city ?? '',
      description: editData.description ?? '',
    },
  });

  useEffect(() => {
    if (isEditMode && editData) {
      reset({
        projectName: editData.projectName ?? '',
        propertyType: editData.propertyType ?? 'شقق للبيع',
        price: editData.price?.toString() ?? '',
        city: editData.city ?? '',
        description: editData.description ?? '',
      });
    }
  }, [isEditMode, editData, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        console.log('🔄 تعديل:', data);
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('DetailsForDevelopment', { id: editData.id });
        }, 1500);
      } else {
        console.log('➕ إضافة:', data);
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('DetailsForDevelopment', { id: 'new-id' });
        }, 1500);
      }
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      Alert.alert('نجاح', isEditMode ? 'تم تعديل الإعلان بنجاح' : 'تم إضافة الإعلان بنجاح');
    }
  }, [success]);

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {error && <Text style={styles.error}>{error}</Text>}
        {loading && <ActivityIndicator size="large" color="#6E00FE" style={{ marginVertical: 20 }} />}

        <Text style={styles.title}>{isEditMode ? 'تعديل إعلان' : 'إضافة إعلان جديد'}</Text>

        <Field label="اسم المشروع" name="projectName" control={control} />
        <Field label="نوع العقار" name="propertyType" control={control} />
        <Field label="السعر" name="price" control={control} keyboardType="numeric" />
        <Field label="المدينة" name="city" control={control} />
        <Field label="الوصف" name="description" control={control} multiline />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: '#5c00d1' }
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{isEditMode ? 'تحديث الإعلان' : 'إضافة الإعلان'}</Text>
        </Pressable>

        {isEditMode && (
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && { backgroundColor: '#bbb' }
            ]}
            onPress={() => navigation.navigate('DetailsForDevelopment', { id: editData.id })}
          >
            <Text style={styles.backButtonText}>العودة للتفاصيل</Text>
          </Pressable>
        )}
      </ScrollView>
    </Layout>
  );
};

// ✅ كومبوننت الحقل الواحد لإعادة الاستخدام
const Field = ({ label, name, control, keyboardType = 'default', multiline = false }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
          placeholder={`أدخل ${label.toLowerCase()}`}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      )}
    />
  </>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6E00FE',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 14,
    color: '#333',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#6E00FE',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontSize: 15,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default AddAdvDev;
