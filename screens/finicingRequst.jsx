import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Layout from '../src/Layout';
import { useRoute } from '@react-navigation/native';
import FinancingRequest from '../FireBase/modelsWithOperations/FinancingRequest';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('الاسم مطلوب'),
  income: Yup.number().typeError('رقم فقط').required('الدخل مطلوب'),
  jobTitle: Yup.string().required('المسمى مطلوب'),
  employer: Yup.string().required('جهة العمل مطلوبة'),
  age: Yup.number().typeError('رقم فقط').required('السن مطلوب'),
  dependents: Yup.number().typeError('رقم فقط').required('عدد المعالين مطلوب'),
  repaymentPeriod: Yup.number().typeError('رقم فقط').required('مدة السداد مطلوبة'),
  financing_amount: Yup.number().typeError('رقم فقط').required('مبلغ التمويل مطلوب'),
  maritalStatus: Yup.string().required('الحالة الاجتماعية مطلوبة'),
});

const FinancingRequestComponent = ({ navigation }) => {
  const route = useRoute();
  const { advertisementId, advertisementTitle, userId } = route.params || {};
  const [monthlyInstallment, setMonthlyInstallment] = useState('0.00');

  return (
    <Layout>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={styles.title}>إنشاء طلب تمويل عقاري</Text>
          <Text style={styles.subtitle}>
            {advertisementTitle ? `إعلان: ${advertisementTitle}` : 'إعلان غير محدد'}
          </Text>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Formik
              initialValues={{
                name: '',
                income: '',
                jobTitle: '',
                employer: '',
                age: '',
                dependents: '',
                repaymentPeriod: '',
                financing_amount: '',
                maritalStatus: '',
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setFieldError }) => {
                try {
                  const financingRequest = new FinancingRequest({
                    user_id: userId || 'guest',
                    advertisement_id: advertisementId,
                    financing_amount: parseFloat(values.financing_amount),
                    repayment_years: parseInt(values.repaymentPeriod, 10),
                  });
                  const ad = await financingRequest.getAdvertisement();
                  if (!ad) {
                    setFieldError('financing_amount', 'إعلان التمويل غير موجود');
                    return;
                  }
                  const { start_limit, end_limit } = ad;
                  if (values.financing_amount < start_limit || values.financing_amount > end_limit) {
                    setFieldError('financing_amount', `مبلغ التمويل يجب أن يكون بين ${start_limit} و ${end_limit}`);
                    return;
                  }
                  navigation.navigate('DisplayDataScreenFinicingRequst', {
                    formData: values,
                    advertisementId,
                    advertisementTitle,
                    userId,
                  });
                } catch (error) {
                  setFieldError('financing_amount', 'حدث خطأ أثناء التحقق من مبلغ التمويل');
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
                setFieldError,
              }) => {
                useEffect(() => {
                  const calculateInstallment = async () => {
                    if (values.financing_amount && values.repaymentPeriod && advertisementId) {
                      try {
                        const financingRequest = new FinancingRequest({
                          user_id: userId || 'guest',
                          advertisement_id: advertisementId,
                          financing_amount: parseFloat(values.financing_amount),
                          repayment_years: parseInt(values.repaymentPeriod, 10),
                          monthly_income: parseFloat(values.income) || 0,
                          job_title: values.jobTitle || '',
                          employer: values.employer || '',
                          age: parseInt(values.age, 10) || 0,
                          marital_status: values.maritalStatus || '',
                          dependents: parseInt(values.dependents, 10) || 0,
                        });
                        const ad = await financingRequest.getAdvertisement();
                        if (!ad) {
                          setMonthlyInstallment('0.00');
                          return;
                        }
                        const { start_limit, end_limit } = ad;
                        if (values.financing_amount < start_limit || values.financing_amount > end_limit) {
                          setMonthlyInstallment('0.00');
                          return;
                        }
                        const installment = await financingRequest.calculateMonthlyInstallment();
                       
                        setMonthlyInstallment(installment);
                      } catch (error) {
                       
                        setMonthlyInstallment('0.00');
                      }
                    } else {
                      setMonthlyInstallment('0.00');
                    }
                  };

                  calculateInstallment();
                }, [values.financing_amount, values.repaymentPeriod, advertisementId, userId]);

                return (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>الاسم</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholder="ادخل الاسم"
                      />
                      {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>الدخل الشهري</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('income')}
                        onBlur={handleBlur('income')}
                        value={values.income}
                        placeholder="مثال: 5000"
                        keyboardType="numeric"
                      />
                      {touched.income && errors.income && <Text style={styles.error}>{errors.income}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>المسمى الوظيفي</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('jobTitle')}
                        onBlur={handleBlur('jobTitle')}
                        value={values.jobTitle}
                        placeholder="مثال: مهندس"
                      />
                      {touched.jobTitle && errors.jobTitle && <Text style={styles.error}>{errors.jobTitle}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>جهة العمل</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('employer')}
                        onBlur={handleBlur('employer')}
                        value={values.employer}
                        placeholder="مثال: شركة XYZ"
                      />
                      {touched.employer && errors.employer && <Text style={styles.error}>{errors.employer}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>السن</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('age')}
                        onBlur={handleBlur('age')}
                        value={values.age}
                        placeholder="مثال: 30"
                        keyboardType="numeric"
                      />
                      {touched.age && errors.age && <Text style={styles.error}>{errors.age}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>عدد المعالين</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('dependents')}
                        onBlur={handleBlur('dependents')}
                        value={values.dependents}
                        placeholder="مثال: 2"
                        keyboardType="numeric"
                      />
                      {touched.dependents && errors.dependents && <Text style={styles.error}>{errors.dependents}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>مدة السداد (بالسنوات)</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('repaymentPeriod')}
                        onBlur={handleBlur('repaymentPeriod')}
                        value={values.repaymentPeriod}
                        placeholder="مثال: 10"
                        keyboardType="numeric"
                      />
                      {touched.repaymentPeriod && errors.repaymentPeriod && <Text style={styles.error}>{errors.repaymentPeriod}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>مبلغ التمويل</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange('financing_amount')}
                        onBlur={handleBlur('financing_amount')}
                        value={values.financing_amount}
                        placeholder="مثال: 100000"
                        keyboardType="numeric"
                      />
                      {touched.financing_amount && errors.financing_amount && <Text style={styles.error}>{errors.financing_amount}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>القسط الشهري (جنيه مصرى)</Text>
                      <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={monthlyInstallment}
                        editable={false}
                        placeholder="سيتم الحساب تلقائيًا"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>الحالة الاجتماعية</Text>
                      <View style={styles.pickerWrapper}>
                        <Picker
                          selectedValue={values.maritalStatus}
                          onValueChange={(value) => setFieldValue('maritalStatus', value)}
                          style={styles.picker}
                        >
                          <Picker.Item label="اختر الحالة" value="" />
                          <Picker.Item label="أعزب" value="single" />
                          <Picker.Item label="متزوج" value="married" />
                          <Picker.Item label="مطلق" value="divorced" />
                          <Picker.Item label="أرمل" value="widowed" />
                        </Picker>
                      </View>
                      {touched.maritalStatus && errors.maritalStatus && (
                        <Text style={styles.error}>{errors.maritalStatus}</Text>
                      )}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                      <Text style={styles.buttonText}>إرسال</Text>
                    </TouchableOpacity>
                  </>
                );
              }}
            </Formik>
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Layout>
  );
};

export default FinancingRequestComponent;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
    color: '#6E00FE',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#444',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#555',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'right',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4D00B1',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  picker: {
    height: 60,
    textAlign: 'right',
  },
});