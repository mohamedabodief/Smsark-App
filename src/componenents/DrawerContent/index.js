// components/DrawerContent.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer, Text, IconButton, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function DrawerContent({ navigation, toggleMode, unreadCount, totalUnreadMessages, userType }) {
//   const navigation = useNavigation();

  const handleNavigate = (route) => {
    navigation.navigate(route);
    navigation.closeDrawer();
    // onClose();
  };

  return (
    <View style={styles.drawer}>
      <IconButton icon="close" onPress={() => navigation.closeDrawer()} />

      <Drawer.Section title="القائمة">

        <Drawer.Item label="الصفحة الرئيسية" onPress={() => handleNavigate('Home')} />
        <Drawer.Item label="إضافة عقار" onPress={() => handleNavigate('AddProperty')} />
        <Drawer.Item label="عن الموقع" onPress={() => handleNavigate('About')} />
        <Drawer.Item label="الصفحة الشخصية" onPress={() => handleNavigate('profile')} />
        <Drawer.Item label="تواصل معنا" onPress={() => handleNavigate('Contact')} />

        <Drawer.Item
          label="المفضلة"
          icon="heart"
          onPress={() => handleNavigate('Favorite')}
        />

        <Drawer.Item label="تبديل الثيم" icon="theme-light-dark" onPress={toggleMode} />

      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: '#6E00FE',
    color: '#fff',
  },
});
