// components/DrawerContent.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Drawer, IconButton, useTheme, Text } from 'react-native-paper';

export default function DrawerContent({ navigation, toggleMode, unreadCount, totalUnreadMessages, userType, ...props }) {
  const { colors } = useTheme();

  const handleNavigate = (route) => {
    navigation.navigate(route);
    navigation.closeDrawer();
  };

  const drawerItemProps = {
    labelStyle: { color: colors.onBackground }, // لون النص حسب الثيم
    style: { borderBottomWidth: 0.5, borderBottomColor: colors.outlineVariant || colors.border || '#ccc' },
  };

  return (
    <View style={[styles.drawer, { backgroundColor: colors.background }]}>
      <ScrollView>
        <IconButton icon="close" onPress={() => navigation.closeDrawer()} iconColor={colors.onBackground} />

        <Drawer.Section
          title={<Text style={[styles.title, { color: colors.onBackground }]}>القائمة</Text>}
        >
          <Drawer.Item label="الصفحة الرئيسية" onPress={() => handleNavigate('Home')} {...drawerItemProps} />
          <Drawer.Item label="إضافة عقار" onPress={() => handleNavigate('AddProperty')} {...drawerItemProps} />
          <Drawer.Item label="عن الموقع" onPress={() => handleNavigate('About')} {...drawerItemProps} />
          <Drawer.Item label="الصفحة الشخصية" onPress={() => handleNavigate('profile')} {...drawerItemProps} />
          {/* <Drawer.Item label="تواصل معنا" onPress={() => handleNavigate('Contact')} {...drawerItemProps} /> */}
          <Drawer.Item label="المفضلة" icon="heart" onPress={() => handleNavigate('Favorite')} {...drawerItemProps} />
          {/* <Drawer.Item label="تبديل الثيم" icon="theme-light-dark" onPress={toggleMode} {...drawerItemProps} /> */}
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
