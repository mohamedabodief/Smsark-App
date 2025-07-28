import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import loginWithEmailAndPassword from '../../FireBase/authService/loginWithEmailAndPassword'; // تأكد من المسار الصحيح

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await loginWithEmailAndPassword(email, password);
    setLoading(false);

    if (result.success) {
      setMessage('✅ تم تسجيل الدخول بنجاح 🎉');
      setTimeout(() => {
        setMessage('');
        // يمكنك تغيير 'Home' إلى الشاشة المناسبة
        navigation.replace('MainApp'); 
      }, 2000);
    } else {
      setMessage(`❌ ${result.error}`);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {message ? (
        <View
          style={{
            backgroundColor: message.startsWith('✅') ? 'green' : 'red',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>{message}</Text>
        </View>
      ) : null}

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>تسجيل الدخول</Text>

      <TextInput
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: '#2196F3', padding: 12, borderRadius: 5 }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
            تسجيل الدخول
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={{ color: 'blue', marginTop: 15, textAlign: 'center' }}>
          هل نسيت كلمة المرور؟
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <Text>ليس لديك حساب؟ </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register', { screen: 'EmailPassword' })}
        >
          <Text style={{ color: 'blue' }}>إنشاء حساب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
