import React from 'react';
import { View, Button, Text } from 'react-native';

export default function SelectUserTypeScreen({ route, navigation }) {
  const { uid } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 20 }}>اختر نوع الحساب:</Text>
      <Button
        title="عميل"
        onPress={() => navigation.navigate('ClientDetails', { uid })}
      />
      <View style={{ height: 10 }} />
      <Button
        title="مؤسسة"
        onPress={() => navigation.navigate('OrganizationDetails', { uid })}
      />
    </View>
  );
}
