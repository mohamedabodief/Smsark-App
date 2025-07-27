import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, I18nManager } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

const PropertyForm = ({
  onSubmit,
  loading = false,
  initialData = {},
  isEditMode = false,
  submitButtonLabel,
}) => {
    const { control, handleSubmit } = useForm({
    defaultValues: {
      projectName: initialData?.projectName ?? '',
      propertyType: initialData?.propertyType ?? 'شقق للبيع',
      price: initialData?.price ?? '',
      city: initialData?.city ?? '',
      description: initialData?.description ?? '',
    }
  });


  return (
    <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* اسم المشروع */}
      <FormLabel label="اسم المشروع" />
      <Controller
        control={control}
        name="projectName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="أدخل اسم المشروع"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* نوع العقار */}
      <FormLabel label="نوع العقار" />
      <Controller
        control={control}
        name="propertyType"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="اختر نوع العقار" value="" />
              <Picker.Item label="شقق للبيع" value="شقق للبيع" />
              <Picker.Item label="فيلات" value="فيلات" />
              <Picker.Item label="أراضي" value="أراضي" />
            </Picker>
          </View>
        )}
      />

      {/* السعر */}
      <FormLabel label="السعر" />
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="أدخل السعر"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* المدينة */}
      <FormLabel label="المدينة" />
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="أدخل المدينة"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* الوصف */}
      <FormLabel label="الوصف" />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="أدخل وصف العقار"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <View style={styles.buttonWrapper}>
        <Button
          title={submitButtonLabel || (isEditMode ? 'تحديث الإعلان' : 'إضافة الإعلان')}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          color="#6E00FE"
        />
      </View>
    </ScrollView>
  );
};

const FormLabel = ({ label }) => (
  <Text style={styles.label}>{label}</Text>
);

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#f9f9f9',
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

export default PropertyForm;
