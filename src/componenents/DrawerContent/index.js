import { View, StyleSheet } from 'react-native';
import { Drawer, IconButton, Alert } from 'react-native-paper';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { CommonActions } from '@react-navigation/native';

export default function DrawerContent({ navigation, toggleMode, userType }) {
  const { logout, user } = useContext(AuthContext);
  const userId = user && user.uid ? user.uid : 'guest';

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

  return (
    <View style={styles.drawer}>
      <IconButton icon="close" onPress={() => navigation.closeDrawer()} />

      <Drawer.Section title="القائمة">
        <Drawer.Item
          label="الصفحة الرئيسية"
          onPress={() => handleNavigate('MainStack', { screen: 'Home' })}
        />
        <Drawer.Item
          label="إضافة عقار"
          onPress={() => handleNavigate('AddClientAds')}
        />
        <Drawer.Item
          label="عن الموقع"
          onPress={() => handleNavigate('About')}
        />
        <Drawer.Item
          label="الصفحة الشخصية"
          onPress={() => handleNavigate('profile')}
        />
        <Drawer.Item
          label="إعلاناتي"
          onPress={() => handleNavigate('MyAds')}
        />
        <Drawer.Item
          label="المفضلة"
          icon="heart"
          onPress={() => handleNavigate('Favorite')}
        />
        <Drawer.Item
          label="طلباتي"
          onPress={() => handleNavigate('MyOrders')}
        />
        <Drawer.Item
          label="تبديل الثيم"
          icon="theme-light-dark"
          onPress={toggleMode}
        />
        <Drawer.Item
          label="تسجيل الخروج"
          icon="logout"
          onPress={handleLogout}
        />
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