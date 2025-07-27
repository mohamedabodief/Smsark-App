// AddFinancingAdFormNative.js
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Layout from '../../Layout';
export default function AddAdFin() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    const requiredFields = Object.entries(form);
    for (let [key, value] of requiredFields) {
      if (!value.trim()) {
        setError(`من فضلك أدخل ${key}`);
        return;
      }
    }
    setError(null);
    setSuccess(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("تم الحفظ بنجاح");
    }, 1500);
  };

  return (
    <Layout>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>إضافة إعلان تمويل جديد</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>تم حفظ الإعلان بنجاح!</Text>}

      {[
        { label: 'عنوان الإعلان', key: 'title' },
        { label: 'الوصف', key: 'description', multiline: true },
        { label: 'اسم الجهة', key: 'org_name' },
        { label: 'رقم الهاتف', key: 'phone' },
        { label: 'الحد الأدنى (جنيه)', key: 'start_limit' },
        { label: 'الحد الأقصى (جنيه)', key: 'end_limit' },
        { label: 'فائدة حتى 5 سنوات (%)', key: 'interest_rate_upto_5' },
        { label: 'فائدة حتى 10 سنوات (%)', key: 'interest_rate_upto_10' },
        { label: 'فائدة أكثر من 10 سنوات (%)', key: 'interest_rate_above_10' },
      ].map(({ label, key, multiline }) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.multiline]}
            value={form[key]}
            onChangeText={(text) => handleChange(key, text)}
            multiline={multiline}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>حفظ الإعلان</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6E00FE',
    borderBottomWidth: 2,
    borderColor: '#6E00FE',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    textAlign: 'right',
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: 'right',
    backgroundColor: '#f9f9f9',
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#6E00FE',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'right',
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'right',
  },
});


