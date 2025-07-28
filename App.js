import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DisplayDataScreenFinicingRequst from './screens/DisplayDataScreenFinicingRequst.jsx'
import FinancingRequest from './screens/finicingRequst.jsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModernRealEstateForm from './screens/AddAds.jsx';
import DisplayInfoAddClientAds from './screens/displayInfoAddClientAds.jsx';
import AddDeveloperAdsForm from './screens/AddDeveloperAds.jsx';
import DisplayInfoAddDeveloperAds from './screens/displayInfoAddDeveloperAds.jsx';
import SearchPage from './screens/SearchPage.jsx'
import SellPage from './screens/sell.jsx';
import DeveloperPage from './screens/developer.jsx';
import FinancingPage from './screens/financing.jsx';
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
import DetailsForFinancingAds from './src/componenents/DetailsForFinancingAds/index.js';
import DetailsForDevelopment from './src/componenents/DetailsForDevelopmentAds/index.js';
import DetailsForClient from './src/componenents/DetailsForClient/index.js';
// import seed from './src/Homeparts/addfakedata/index.js';
// import RealEstateDeveloperAdvertisement from './FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement.js';
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    // <View style={styles.container}>
    //   <StatusBar style="auto" />
    //    <NavigationContainer>
    //     <Stack.Navigator screenOptions={{ headerShown: false }}>
    //       <Stack.Screen name="AddAds" component={ModernRealEstateForm} options={{ title: 'إضافة إعلان عميل' }} />
    //       <Stack.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} options={{ title: 'مراجعة بيانات العميل' }} />
    //       <Stack.Screen name="AddDeveloperAds" component={AddDeveloperAdsForm} options={{ title: 'إضافة إعلان مطور' }} />
    //       <Stack.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} options={{ title: 'مراجعة بيانات المطور' }} />
    //       <Stack.Screen name="FinancingRequest" component={FinancingRequest} options={{ title: 'طلب تمويل' }} />
    //       <Stack.Screen name="displayInfo" component={DisplayDataScreenFinicingRequst} />
    //     </Stack.Navigator>
    //   </NavigationContainer> 
    //   {/* <SearchPage/> */}
    //    {/* <SellPage/>  */}
    //   {/* <DeveloperPage/> */}
    //   {/* <FinancingPage/> */}
    // </View>

  <Provider store={store}>
    <AppNavigator />
  </Provider>)}
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
        {/* <Drawer.Screen name="AddClientAds" component={AddAdForm} /> */}
        {/* <Drawer.Screen name="AddDeveloperAd" component={AddAdvDev} /> */}
        {/* <Drawer.Screen name="AddFinancingAds" component={AddAdFin} /> */}
        <Drawer.Screen name="About" component={AboutUsScreen} />
        <Drawer.Screen name="Favorite" component={FavoritesScreen} />
        <Drawer.Screen name="profile" component={ProfileScreen} />
        <Drawer.Screen name="AddAds" component={ModernRealEstateForm} options={{ title: 'إضافة إعلان عميل' }} />
        <Drawer.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} options={{ title: 'مراجعة بيانات العميل' }} />
        <Drawer.Screen name="AddDeveloperAds" component={AddDeveloperAdsForm} options={{ title: 'إضافة إعلان مطور' }} />
        <Drawer.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} options={{ title: 'مراجعة بيانات المطور' }} />
        <Drawer.Screen name="FinancingRequest" component={FinancingRequest} options={{ title: 'طلب تمويل' }} />
        <Drawer.Screen name="displayInfo" component={DisplayDataScreenFinicingRequst} />
        <Drawer.Screen name="detailsForFinancingAds" component={DetailsForFinancingAds} />
        <Drawer.Screen name="DevelopmentDetails" component={DetailsForDevelopment} />
        <Drawer.Screen name="ClientDetails" component={DetailsForClient} />
        
        

      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});





