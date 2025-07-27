// src/components/Profile.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../../Layout';
export default function ProfileScreen() {
  // بيانات وهمية
  const user = {
    name: 'محمد عبد الله',
    age: 28,
    gender: 'ذكر',
    email: 'mohamed@example.com',
    address: 'القاهرة، مصر',
    image: 'https://i.pravatar.cc/200', // صورة رمزية عشوائية
  };

  return (
    <Layout>
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.image }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.infoBox}>
        <Icon name="person" size={22} color="#555" />
        <Text style={styles.infoText}>النوع: {user.gender}</Text>
      </View>

      <View style={styles.infoBox}>
        <Icon name="cake" size={22} color="#555" />
        <Text style={styles.infoText}>العمر: {user.age} سنة</Text>
      </View>

      <View style={styles.infoBox}>
        <Icon name="email" size={22} color="#555" />
        <Text style={styles.infoText}>البريد: {user.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Icon name="location-on" size={22} color="#555" />
        <Text style={styles.infoText}>العنوان: {user.address}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>تحديث كلمة المرور</Text>
      </TouchableOpacity>
    </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#6E00FE',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
