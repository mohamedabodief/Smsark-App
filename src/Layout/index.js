import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../FireBase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import Nav from '../componenents/Nav';
import FooterNav from '../componenents/Footer';
import StatusBarComponent from '../../screens/components/StatusBarComponent';

async function saveToken(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
  }
}
async function getToken(key) {
  try {
    const token = await SecureStore.getItemAsync(key);
    return token;
  } catch (error) {
    return null;
  }
}

export default function Layout({ children, showDrawer = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(false);
      if (user) {
        await saveToken('userToken', user.accessToken);
        setIsAuthenticated(true);
        if (['SignIn', 'Login'].includes(route.name)) {
          navigation.navigate('Home');
        }
      } else {
        const token = await getToken('userToken');
        if (token) {
          setIsAuthenticated(true);
          // لا تنتقل إلى Home إذا كانت الشاشة الحالية ليست SignIn أو Login
          if (['SignIn', 'Login'].includes(route.name)) {
            navigation.navigate('Home');
          }
        } else {
          setIsAuthenticated(false);
          if (!['SignIn', 'Login'].includes(route.name)) {
            navigation.navigate('SignIn');
          }
        }
      }
    });

    return () => {
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
    return null;
  }
  return (
    <StatusBarComponent backgroundColor="#ffffff" barStyle="dark-content">
    <View style={styles.container}>
      <Nav />
      <View style={styles.content}>
        <View style={styles.innerContent}>
          {children}
        </View>
        <FooterNav />
      </View>
    </View>
    </StatusBarComponent>
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