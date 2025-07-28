import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Nav from '../componenents/Nav';
import FooterNav from '../componenents/Footer';
import DrawerContent from '../componenents/DrawerContent';

export default function Layout({ children, showDrawer = false }) {
  const navigation = useNavigation();

  if (showDrawer) {
    return (
      <View style={styles.container}>
        <Nav />
        <View style={styles.content}>
          <View style={styles.innerContent}>
            {children}
          </View>
          <FooterNav />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Nav />
      <View style={styles.content}>
        <View style={styles.innerContent}>
          {children}
        </View>
        <FooterNav />
      </View>
    </View>
  );
}

const FOOTER_HEIGHT = 90; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  innerContent: {
    flex: 1,
    paddingBottom: FOOTER_HEIGHT, 
  },
});
