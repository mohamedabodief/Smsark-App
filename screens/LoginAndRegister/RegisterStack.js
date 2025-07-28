// RegisterStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailPasswordScreen from './EmailPasswordScreen';
import SelectUserTypeScreen from './SelectUserTypeScreen';
import ClientDetailsScreen from './ClientDetailsScreen';
import OrganizationDetailsScreen from './OrganizationDetailsScreen';

const Stack = createNativeStackNavigator();

export default function RegisterStack() {
  return (
    <Stack.Navigator initialRouteName="EmailPassword" screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
      screenOptions={{
        headerShown: false,
      }}
        name="EmailPassword"
        component={EmailPasswordScreen}
        options={{ title: 'إنشاء حساب' }}
      />
      <Stack.Screen
      screenOptions={{
        headerShown: false,
      }}
        name="SelectUserType"
        component={SelectUserTypeScreen}
        options={{ title: 'نوع المستخدم' }}
      />
      <Stack.Screen
      screenOptions={{
        headerShown: false,
      }}
        name="ClientDetails"
        component={ClientDetailsScreen}
        options={{ title: 'بيانات العميل' }}
      />
      <Stack.Screen
      screenOptions={{
        headerShown: false,
      }}
        name="OrganizationDetails"
        component={OrganizationDetailsScreen}
        options={{ title: 'بيانات المؤسسة' }}
      />
    </Stack.Navigator>
  );
}
