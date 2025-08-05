import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';
import Layout from '../src/Layout';
import { auth } from '../FireBase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebaseConfig';

const DisplayDataScreenFinicingRequst = ({ route, navigation }) => {
  const { formData, advertisementId, advertisementTitle, userId } = route.params;
  const [loading, setLoading] = useState(false);

  const translate = {
    name: 'الاسم',
    income: 'الدخل الشهري',
    jobTitle: 'المسمى الوظيفي',
    employer: 'جهة العمل',
    age: 'السن',
    dependents: 'عدد المعالين',
    repaymentPeriod: 'مدة السداد',
    maritalStatus: 'الحالة الاجتماعية',
    financing_amount: 'مبلغ التمويل',
  };

const handleConfirm = async () => {
  setLoading(true);
  try {
    // التأكد من وجود مستخدم مسجل دخول
    if (!auth.currentUser) {
      throw new Error('لا يوجد مستخدم مسجل دخول');
    }
    if (!advertisementId) {
      throw new Error('معرّف الإعلان غير متوفر');
    }

    // فحص الإعلان في Firestore
    const adRef = doc(db, 'FinancingAdvertisements', advertisementId);
    const adSnap = await getDoc(adRef);
    if (!adSnap.exists()) {
      throw new Error(`إعلان التمويل غير موجود: ${advertisementId}`);
    }

    const financingRequest = new FinancingRequest({
      user_id: userId || auth.currentUser.uid,
      advertisement_id: advertisementId,
      advertisement_title: advertisementTitle || 'غير متوفر',
      monthly_income: parseFloat(formData.income) || 0,
      job_title: formData.jobTitle || '',
      employer: formData.employer || '',
      age: parseInt(formData.age) || 0,
      marital_status: formData.maritalStatus || '',
      dependents: parseInt(formData.dependents) || 0,
      financing_amount: parseFloat(formData.financing_amount) || 100000,
      repayment_years: parseInt(formData.repaymentPeriod) || 5,
      phone_number: formData.phone_number || '',
      status: 'pending',
      reviewStatus: 'pending',
      submitted_at: new Date(), 
    });

    console.log('Saving financing request:', {
      user_id: financingRequest.user_id,
      advertisement_id: financingRequest.advertisement_id,
      advertisement_title: financingRequest.advertisement_title, 
      monthly_income: financingRequest.monthly_income,
      financing_amount: financingRequest.financing_amount,
    });

    const requestId = await financingRequest.save();
    console.log('Financing request saved with ID:', requestId);

    Alert.alert(
      'نجح الحفظ',
      'تم حفظ طلب التمويل بنجاح',
      [
        {
          text: 'حسناً',
          onPress: () => navigation.navigate('MyOrders', { userId: auth.currentUser.uid }) 
        }
      ]
    );
  } catch (error) {
    console.error('Error saving financing request:', error.message);
    Alert.alert(
      'خطأ في الحفظ',
      `حدث خطأ أثناء حفظ طلب التمويل: ${error.message}`,
      [{ text: 'حسناً' }]
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>عرض بيانات التمويل</Text>
        <Text style={styles.subtitle}>عنوان الإعلان: {advertisementTitle || 'غير متوفر'}</Text>

        {Object.entries(formData).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{translate[key] || key}:</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6E00FE" />
              <Text style={styles.loadingText}>جاري الحفظ...</Text>
            </View>
          ) : (
            <>
              <Button
                title="تأكيد"
                onPress={() => {
                  console.log('Confirm button pressed, formData:', formData, 'advertisementId:', advertisementId);
                  handleConfirm();
                }}
                color="#6E00FE"
              />
              <Button
                title="عودة للتعديل"
                onPress={() => navigation.goBack()}
                color="#7e7d80ff"
              />
            </>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#4D00B1',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#444',
  },
  row: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  value: {
    fontSize: 16,
    color: '#222',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    gap: 15,
    marginBottom: 29,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E00FE',
    textAlign: 'center',
  },
});

export default DisplayDataScreenFinicingRequst;