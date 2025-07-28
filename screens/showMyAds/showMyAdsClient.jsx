import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyAdsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>عرض إعلاناتي</Text>
      <Text style={styles.message}>هنا سيتم عرض إعلاناتك الشخصية</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});