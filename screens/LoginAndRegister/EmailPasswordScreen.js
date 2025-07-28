import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import registerWithEmailAndPassword from '../../FireBase/authService/registerWithEmailAndPassword';

export default function EmailPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const result = await registerWithEmailAndPassword(email, password);
    if (result.success) {
      navigation.navigate('SelectUserType', { uid: result.uid });
    } else {
      Alert.alert('خطأ', result.error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button title="التالي" onPress={handleRegister} />
    </View>
  );
}
