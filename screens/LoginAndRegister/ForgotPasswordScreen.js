import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import sendResetPasswordEmail from '../../FireBase/authService/sendResetPasswordEmail';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'يرجى إدخال البريد الإلكتروني',
        position: 'top',
        visibilityTime: 5000,
        topOffset: 50,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: 'black' },
        text2Style: { fontSize: 14, color: 'gray' },
      });
      return;
    }

    const result = await sendResetPasswordEmail(email);
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'نجاح',
        text2: `تم إرسال رابط إلى ${email} لإعادة تعيين كلمة المرور 🎉`,
        position: 'top',
        visibilityTime: 5000,
        topOffset: 50,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: 'black' },
        text2Style: { fontSize: 14, color: 'gray' },
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'حدث خطأ أثناء محاولة الإرسال. تأكد من صحة البريد الإلكتروني.',
        position: 'top',
        visibilityTime: 5000,
        topOffset: 50,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: '#black' },
        text2Style: { fontSize: 14, color: '#gray' },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ImageBackground
        source={require('../../assets/bg-sign.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <View style={styles.formContainer}>
          <Text style={styles.title}>استعادة كلمة المرور</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#5A00D6" style={styles.icon} />
              <TextInput
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>إرسال رابط إعادة التعيين</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>العودة إلى تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'flex-end',
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5A00D6',
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333333',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#5A00D6',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#5A00D6',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
    marginRight: 90,
  },
});



const toastStyles = StyleSheet.create({
  toastContainer: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    width: '90%',
    alignItems: 'center',
    zIndex: 1000, 
  },
  toastText: {
    color: 'black', 
    textAlign: 'center',
  },
});