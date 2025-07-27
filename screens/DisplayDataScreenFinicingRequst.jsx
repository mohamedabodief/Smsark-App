import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';

const DisplayDataScreenFinicingRequst = ({ route, navigation }) => {
  const { formData } = route.params;
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
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const financingRequest = new FinancingRequest({
        user_id: 'temp_user_id', 
        advertisement_id: 'temp_ad_id', 
        monthly_income: parseFloat(formData.income),
        job_title: formData.jobTitle,
        employer: formData.employer,
        age: parseInt(formData.age),
        marital_status: formData.maritalStatus,
        dependents: parseInt(formData.dependents),
        financing_amount: 0, 
        repayment_years: parseInt(formData.repaymentPeriod),
        phone_number: '',
        status: 'pending',
        reviewStatus: 'pending'
      });
      await financingRequest.save();
      
      Alert.alert(
        'نجح الحفظ',
        'done',
        [
          {
            text: 'حسناً',
            onPress: () => navigation.navigate('FinancingRequest')
          }
        ]
      );
    } catch (error) {
      console.error('Error saving financing request:', error);
      Alert.alert(
        'خطأ في الحفظ',
        'حدث خطأ أثناء حفظ طلب التمويل. يرجى المحاولة مرة أخرى.',
        [{ text: 'حسناً' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>عرض بيانات التمويل</Text>

      {Object.entries(formData).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{translate[key]}:</Text>
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
              onPress={handleConfirm}
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
    marginBottom: 25,
    textAlign: 'center',
    color: '#4D00B1',
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