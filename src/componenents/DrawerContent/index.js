import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Drawer, IconButton, useTheme, Text, Alert } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

export default function DrawerContent({ navigation, toggleMode, unreadCount, totalUnreadMessages, userType }) {
  const { logout, user } = useContext(AuthContext);
  const userId = user && user.uid ? user.uid : 'guest';
  const { colors } = useTheme();

  console.log('DrawerContent: Rendering with userId:', userId);

  const handleLogout = async () => {
    try {
      console.log('DrawerContent: Attempting to sign out');
      await logout();
      console.log('DrawerContent: Sign out completed, resetting navigation to Login');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('DrawerContent: Logout failed:', error);
      Alert.alert('خطأ', 'فشل تسجيل الخروج. حاولي مرة أخرى.');
    }
  };

  const handleNavigate = (route, params) => {
    try {
      console.log('DrawerContent: Navigating to', route, params || '');
      navigation.navigate(route, params);
      navigation.closeDrawer();
    } catch (error) {
      console.error('DrawerContent: Navigation failed:', error);
      Alert.alert('خطأ', `فشل التنقل إلى ${route}.`);
    }
  };

  const drawerItemProps = {
    labelStyle: { color: colors.onBackground },
    style: { borderBottomWidth: 0.5, borderBottomColor: colors.outlineVariant || colors.border || '#ccc' },
  };

  return (
    <View style={[styles.drawer, { backgroundColor: colors.background }]}>
      <ScrollView>
        <IconButton icon="close" onPress={() => navigation.closeDrawer()} iconColor={colors.onBackground} />
        <Drawer.Section title={<Text style={[styles.title, { color: colors.onBackground }]}>القائمة</Text>}>
          <Drawer.Item
            label="الصفحة الرئيسية"
            onPress={() => handleNavigate('MainStack', { screen: 'Home' })}
            {...drawerItemProps}
          />
          <Drawer.Item
            label="إضافة عقار"
            onPress={() => handleNavigate('AddClientAds')}
            {...drawerItemProps}
          />
          <Drawer.Item
            label="عن الموقع"
            onPress={() => handleNavigate('About')}
            {...drawerItemProps}
          />
          <Drawer.Item
            label="الصفحة الشخصية"
            onPress={() => handleNavigate('profile')}
            {...drawerItemProps}
          />
          <Drawer.Item
            label="إعلاناتي"
            onPress={() => handleNavigate('MyAds')}
            {...drawerItemProps}
          />
       
          <Drawer.Item
            label="طلباتي"
            onPress={() => handleNavigate('MyOrders')}
            {...drawerItemProps}
          />

             <Drawer.Item
            label="المفضلة"
            icon="heart"
            onPress={() => handleNavigate('Favorite')}
            {...drawerItemProps}
          />
          <Drawer.Item
            label="تبديل الثيم"
            icon="theme-light-dark"
            onPress={toggleMode}
            {...drawerItemProps}
          />
          <Drawer.Item
  label="تواصل معنا"
   icon="headset"
  onPress={() => handleNavigate('ContactUs')}
  {...drawerItemProps}
/>
          <Drawer.Item
            label="تسجيل الخروج"
            icon="logout"
            onPress={handleLogout}
            {...drawerItemProps}
          />
        </Drawer.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});