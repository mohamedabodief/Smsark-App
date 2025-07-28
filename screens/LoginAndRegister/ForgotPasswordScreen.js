import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import sendResetPasswordEmail from '../../FireBase/authService/sendResetPasswordEmail';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const result = await sendResetPasswordEmail(email);
    if (result.success) {
      setMessage(`تم إرسال رابط إلى ${email} لإعادة تعيين كلمة المرور 🎉`);
      setTimeout(() => setMessage(''), 3000); // الرسالة تختفي بعد 3 ثواني
    } else {
      setMessage(
        'حدث خطأ أثناء محاولة الإرسال. تأكد من صحة البريد الإلكتروني.'
      );
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* رسالة مؤقتة */}
      {message ? (
        <View
          style={{
            backgroundColor: 'green',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>{message}</Text>
        </View>
      ) : null}

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        استعادة كلمة المرور
      </Text>

      <TextInput
        placeholder="أدخل بريدك الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TouchableOpacity
        onPress={handleReset}
        style={{ backgroundColor: '#2196F3', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          إرسال رابط إعادة التعيين
        </Text>
      </TouchableOpacity>
    </View>
  );
}
