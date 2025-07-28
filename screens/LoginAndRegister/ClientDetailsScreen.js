import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import User from '../../FireBase/modelsWithOperations/User';

export default function ClientDetailsScreen({ route, navigation }) {
  const { uid } = route.params;
  const [cli_name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSave = async () => {
    try {
      const user = new User({
        uid,
        type_of_user: 'client',
        cli_name,
        age,
        gender,
      });
      await user.saveToFirestore();
      Alert.alert('تم', 'تم حفظ البيانات بنجاح');
    } catch (err) {
      Alert.alert('خطأ', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="الاسم"
        value={cli_name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="السن"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="النوع (ذكر/أنثى)"
        value={gender}
        onChangeText={setGender}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="حفظ" onPress={handleSave} />
    </View>
  );
}
