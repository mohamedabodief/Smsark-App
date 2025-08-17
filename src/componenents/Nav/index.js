// Nav.js
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Nav() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fakeCount = 5;
    setUnreadCount(fakeCount);
  }, []);

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action
        icon="menu"
        color="white"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6E00FE',
    marginTop:-33,
  },
  logo: {
    width: 160,
    height: 150,
    marginLeft: 170,
  },
});
