import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { loadFavoritesAsync } from './src/redux/favoritesSlice';

// 🟩 شاشات تسجيل الدخول
import LoginScreen from './screens/LoginAndRegister/LoginScreen.js';
import ForgotPasswordScreen from './screens/LoginAndRegister/ForgotPasswordScreen.js';
// 🟩 شاشات تسجيل الحساب
import RegisterStack from './screens/LoginAndRegister/RegisterStack.js';

// 🟩 شاشات التطبيق الرئيسية
import Home from './src/componenents/Home';
import DrawerContent from './src/componenents/DrawerContent';
import FavoritesScreen from './src/componenents/Favorite';
import AboutUsScreen from './src/componenents/aboutUs';
import ProfileScreen from './src/componenents/profile';
import ModernRealEstateForm from './screens/AddAds.jsx';
import DisplayInfoAddClientAds from './screens/displayInfoAddClientAds.jsx';
import AddDeveloperAdsForm from './screens/AddDeveloperAds.jsx';
import DisplayInfoAddDeveloperAds from './screens/displayInfoAddDeveloperAds.jsx';
import FinancingRequest from './screens/finicingRequst.jsx';
import DisplayDataScreenFinicingRequst from './screens/DisplayDataScreenFinicingRequst.jsx';
import DetailsForFinancingAds from './src/componenents/DetailsForFinancingAds/index.js';
import DetailsForDevelopment from './src/componenents/DetailsForDevelopmentAds/index.js';
import DetailsForClient from './src/componenents/DetailsForClient/index.js';
import OrganizationDetailsScreen from './screens/LoginAndRegister/OrganizationDetailsScreen.js';
import SearchPage from './screens/SearchPage.jsx';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function AppDrawer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFavoritesAsync());
  }, [dispatch]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About" component={AboutUsScreen} />
      <Drawer.Screen name="Favorite" component={FavoritesScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="AddAds" component={ModernRealEstateForm} />
      <Drawer.Screen
        name="DisplayInfoAddClientAds"
        component={DisplayInfoAddClientAds}
      />
      <Drawer.Screen name="AddDeveloperAds" component={AddDeveloperAdsForm} />
      <Drawer.Screen
        name="DisplayInfoAddDeveloperAds"
        component={DisplayInfoAddDeveloperAds}
      />
      <Drawer.Screen name="FinancingRequest" component={FinancingRequest} />
      <Drawer.Screen
        name="displayInfo"
        component={DisplayDataScreenFinicingRequst}
      />
      <Drawer.Screen
        name="detailsForFinancingAds"
        component={DetailsForFinancingAds}
      />
      <Drawer.Screen
        name="DevelopmentDetails"
        component={DetailsForDevelopment}
      />
      <Drawer.Screen name="ClientDetails" component={DetailsForClient} />
      <Drawer.Screen name="Search" component={SearchPage} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="MainApp" component={AppDrawer} />
            <Stack.Screen name="Register" component={RegisterStack} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
