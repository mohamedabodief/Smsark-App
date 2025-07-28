import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import User from '../../FireBase/modelsWithOperations/User';

export default function OrganizationDetailsScreen({ route }) {
  const { uid } = route.params;
  const [org_name, setName] = useState('');
  const [type_of_organization, setType] = useState('');

  const handleSave = async () => {
    try {
      const user = new User({
        uid,
        type_of_user: 'organization',
        org_name,
        type_of_organization,
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
        placeholder="اسم المؤسسة"
        value={org_name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="نوع المؤسسة"
        value={type_of_organization}
        onChangeText={setType}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="حفظ" onPress={handleSave} />
    </View>
  );
}
