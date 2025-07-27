import React from 'react';
import { View, StyleSheet } from 'react-native';
import Nav from '../componenents/Nav';
import FooterNav from '../componenents/Footer';

export default function Layout({ children }) {
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
