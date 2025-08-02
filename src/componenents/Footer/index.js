// src/components/FooterNav.js
import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function FooterNav() {
  const navigation = useNavigation();
  const route = useRoute();

  const routes = [
    { key: 'Home', title: 'الرئيسية' },
    { key: 'search', title: 'بحث' },
    { key: 'favorite', title: 'المفضلة' },
    { key: 'profile', title: 'حسابي' },
  ];

  const getIndexFromRoute = () => {
    switch (route.name) {
      case 'Home': return 0;
      case 'Search': return 1;
      case 'Favorite': return 2;
      case 'profile': return 3;
      default: return 0;
    }
  };

  const index = getIndexFromRoute();


  const handleIndexChange = (newIndex) => {
  const screenMap = ['Home', 'Search', 'Favorite', 'profile'];
  const screen = screenMap[newIndex];
  if (screen === 'Home') {
      navigation.navigate('MainStack', { screen: 'Home' }); // ← الحل هنا
    } else {
      navigation.navigate(screen);
    }
  };

  // ✅ مكون مسؤول عن رسم الأيقونات يدويًا
const renderIcon = ({ route, color, focused }) => {
  const iconStyle = {
    backgroundColor: focused ? '#ccc' : 'transparent',
    padding: 5,
    borderRadius: 20, 
  };

  switch (route.key) {
    case 'Home':
      return (
        <View style={iconStyle}>
          <AntDesign name="home" size={20} color={focused ? '#000' : color} />
        </View>
      );
    case 'search':
      return (
        <View style={iconStyle}>
          <Feather name="search" size={20} color={focused ? '#000' : color} />
        </View>
      );
    case 'favorite':
      return (
        <View style={iconStyle}>
          <AntDesign name="hearto" size={20} color={focused ? '#000' : color} />
        </View>
      );
    case 'profile':
      return (
        <View style={iconStyle}>
          <AntDesign name="user" size={20} color={focused ? '#000' : color} />
        </View>
      );
    default:
      return null;
  }
};


  return (
    <View style={styles.container}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
        renderScene={() => null}
        renderIcon={renderIcon}
        barStyle={styles.bar}
        activeColor="#fff"
        inactiveColor="#ddd"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    // paddingTop: 0,
    backgroundColor: '#6E00FE',
  },
});
