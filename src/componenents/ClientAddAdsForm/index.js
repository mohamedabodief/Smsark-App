import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Layout from '../../Layout';
// import { useForm, Controller } from 'react-hook-form';

export default function ClientAddAdsForm() {
  const { control, handleSubmit } = useForm();
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const onSubmit = data => {
    const fullData = {
      ...data,
      governorate,
      city,
      image: selectedImage
    };
    console.log(fullData);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <Layout>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>إضافة إعلان عقاري</Text>

      <Text style={styles.label}>عنوان الإعلان</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="مثال: شقة للبيع في القاهرة" />
        )}
      />

      <Text style={styles.label}>نوع العقار</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="مثال: شقة، فيلا..." />
        )}
      />

      <Text style={styles.label}>السعر</Text>
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, value } }) => (
          <TextInput keyboardType="numeric" style={styles.input} onChangeText={onChange} value={value} placeholder="مثال: 500000" />
        )}
      />

      <Text style={styles.label}>المساحة (متر مربع)</Text>
      <Controller
        control={control}
        name="area"
        render={({ field: { onChange, value } }) => (
          <TextInput keyboardType="numeric" style={styles.input} onChangeText={onChange} value={value} placeholder="مثال: 120" />
        )}
      />

      <Text style={styles.label}>الوصف</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput multiline numberOfLines={4} style={[styles.input, styles.textArea]} onChangeText={onChange} value={value} placeholder="اكتب تفاصيل الإعلان هنا" />
        )}
      />

      <Text style={styles.label}>المحافظة</Text>
      <Picker
        selectedValue={governorate}
        onValueChange={(itemValue) => setGovernorate(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="اختر المحافظة" value="" />
        <Picker.Item label="القاهرة" value="القاهرة" />
        <Picker.Item label="الإسكندرية" value="الإسكندرية" />
        <Picker.Item label="الجيزة" value="الجيزة" />
      </Picker>

      <Text style={styles.label}>المدينة</Text>
      <Picker
        selectedValue={city}
        onValueChange={(itemValue) => setCity(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="اختر المدينة" value="" />
        <Picker.Item label="مدينة نصر" value="مدينة نصر" />
        <Picker.Item label="الهرم" value="الهرم" />
        <Picker.Item label="المعادي" value="المعادي" />
      </Picker>

      <Text style={styles.label}>رابط أو وصف الموقع</Text>
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="مثال: https://goo.gl/maps/..." />
        )}
      />

      <Text style={styles.label}>رقم الهاتف</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput keyboardType="phone-pad" style={styles.input} onChangeText={onChange} value={value} placeholder="مثال: 01012345678" />
        )}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>اختر صورة للإعلان</Text>
      </TouchableOpacity>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>نشر الإعلان</Text>
      </TouchableOpacity>
    </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  imagePickerButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#333'
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6E00FE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
