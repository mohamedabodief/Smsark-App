import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import User from './FireBase/modelsWithOperations/User';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { loadFavoritesAsync } from './src/redux/favoritesSlice';

import Home from './src/componenents/Home';
import DrawerContent from './src/componenents/DrawerContent';
import FavoritesScreen from './src/componenents/Favorite';
import AboutUsScreen from './src/componenents/aboutUs';
import AddAdForm from './src/componenents/ClientAddAdsForm';
import AddAdvDev from './src/componenents/devAddAdsForm';
import AddAdFin from './src/componenents/FinAddAdsForm';
import ProfileScreen from './src/componenents/profile';

const Drawer = createDrawerNavigator();
function AppNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFavoritesAsync());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="AddClientAds" component={AddAdForm} />
        <Drawer.Screen name="AddDeveloperAds" component={AddAdvDev} />
        <Drawer.Screen name="AddFinancingAds" component={AddAdFin} />

        <Drawer.Screen name="About" component={AboutUsScreen} />
        <Drawer.Screen name="Favorite" component={FavoritesScreen} />
        <Drawer.Screen name="profile" component={ProfileScreen} />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  console.log(
    '🔥 API Key from .env:',
    Constants.expoConfig.extra.FIREBASE_API_KEY
  );
  return (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
  );

}






