import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import loginWithEmailAndPassword from '../../FireBase/authService/loginWithEmailAndPassword';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('❌ يرجى إدخال البريد الإلكتروني وكلمة المرور');
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    setLoading(true);
    const result = await loginWithEmailAndPassword(email, password);
    setLoading(false);

    if (result.success) {
      setMessage('✅ تم تسجيل الدخول بنجاح 🎉');
      setTimeout(() => {
        setMessage('');
        navigation.replace('MainApp');
      }, 2000);
    } else {
      setMessage(`❌ ${result.error}`);
      setTimeout(() => setMessage(''), 4000);
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
          {message ? (
            <View
              style={{
                backgroundColor: message.startsWith('✅') ? 'green' : 'red',
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>{message}</Text>
            </View>
          ) : null}
          <Text style={styles.title}>تسجيل الدخول</Text>
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#5A00D6" style={styles.icon} />
              <TextInput
                placeholder="أدخل كلمة المرور"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.loginText}>هل نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
          
             <TouchableOpacity
              onPress={() => navigation.navigate('Register', { screen: 'EmailPassword' })}
            >
              <Text style={styles.loginText}>ليس لديك حساب انشا حساب</Text>
              
            </TouchableOpacity>
             
         
          </View>
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
    display: 'flex',
    justifyContent: 'center',
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
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#5A00D6',
    marginRight:90
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  marginRight:-10
 
  },
});