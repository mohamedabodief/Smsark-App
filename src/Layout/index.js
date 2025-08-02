import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../FireBase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import Nav from '../componenents/Nav';
import FooterNav from '../componenents/Footer';

// دالة لحفظ التوكن
async function saveToken(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log('Token saved successfully:', key);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

// دالة لاسترجاع التوكن
async function getToken(key) {
  try {
    const token = await SecureStore.getItemAsync(key);
    console.log('Token retrieved:', token ? 'exists' : 'null');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

export default function Layout({ children, showDrawer = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Layout useEffect triggered for route:', route.name);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(false);
      if (user) {
        console.log('User authenticated:', user.uid);
        await saveToken('userToken', user.accessToken);
        setIsAuthenticated(true);
        // لا تنتقل إلى Home إذا كانت الشاشة الحالية ليست SignIn أو Login
        if (['SignIn', 'Login'].includes(route.name)) {
          console.log('Navigating to Home from:', route.name);
          navigation.navigate('Home');
        }
      } else {
        console.log('No user found, checking stored token');
        const token = await getToken('userToken');
        if (token) {
          console.log('Valid token found, setting authenticated');
          setIsAuthenticated(true);
          // لا تنتقل إلى Home إذا كانت الشاشة الحالية ليست SignIn أو Login
          if (['SignIn', 'Login'].includes(route.name)) {
            console.log('Navigating to Home from:', route.name);
            navigation.navigate('Home');
          }
        } else {
          console.log('No user or token, navigating to SignIn');
          setIsAuthenticated(false);
          if (!['SignIn', 'Login'].includes(route.name)) {
            console.log('Navigating to SignIn from:', route.name);
            navigation.navigate('SignIn');
          }
        }
      }
    });

    return () => {
      console.log('Cleaning up onAuthStateChanged for route:', route.name);
      unsubscribe();
    };
  }, [navigation, route]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>جاري التحميل...</Text>
      </View>
    );
  }

  if (!isAuthenticated && !['SignIn', 'Login'].includes(route.name)) {
    // لا نعرض شيء إذا تم التوجيه إلى SignIn
    return null;
  }

  // الـ Layout الأصلي
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