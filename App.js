import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// Screen Components
import LoginScreen from './screens/LoginAndRegister/LoginScreen.js';
import ForgotPasswordScreen from './screens/LoginAndRegister/ForgotPasswordScreen.js';
import RegisterStack from './screens/LoginAndRegister/RegisterStack.js';
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
import SellPage from './screens/sell.jsx';
import DeveloperPage from './screens/developer.jsx';
import FinancingPage from './screens/financing.jsx';
import SearchPage from './screens/SearchPage.jsx';
import AddAdFin from './src/componenents/FinAddAdsForm';
import MyAdsScreen from './screens/showMyAds/showMyAdsClient.jsx';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator لشاشات النماذج
function FormStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#f4511e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} />
      <Stack.Screen name="AddDeveloperAds" component={AddDeveloperAdsForm} />
      <Stack.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} />
      <Stack.Screen name="FinancingRequest" component={FinancingRequest} />
      <Stack.Screen name="DisplayFinancingInfo" component={DisplayDataScreenFinicingRequst} />
      <Stack.Screen name="ModernRealEstateForm" component={ModernRealEstateForm} />
    </Stack.Navigator>
  );
}

// Stack Navigator للشاشات الرئيسية
function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#f4511e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Sell" component={SellPage} />
      <Stack.Screen name="Developer" component={DeveloperPage} />
      <Stack.Screen name="Financing" component={FinancingPage} />
      <Stack.Screen name="Search" component={SearchPage} />
      <Stack.Screen name="detailsForFinancingAds" component={DetailsForFinancingAds} />
      <Stack.Screen name="DevelopmentDetails" component={DetailsForDevelopment} />
      <Stack.Screen name="ClientDetails" component={DetailsForClient} />
    </Stack.Navigator>
  );
}

// Drawer Navigator
function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="MainStack"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#f6f6f6', width: 280 },
        drawerActiveTintColor: '#f4511e',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen
        name="MainStack"
        component={MainStackNavigator}
        options={{ title: 'الرئيسية', drawerLabel: 'الرئيسية' }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchPage}
        options={{ title: 'بحث', drawerLabel: 'بحث' }}
      />
      <Drawer.Screen
        name="FormStack"
        component={FormStackNavigator}
        options={{ title: 'النماذج', drawerLabel: 'النماذج والإعلانات' }}
      />
      <Drawer.Screen
        name="AddClientAds"
        component={ModernRealEstateForm}
        options={{ title: 'إضافة إعلان عميل', drawerLabel: 'إضافة إعلان عميل' }}
      />
      <Drawer.Screen
        name="AddDeveloperAds"
        component={AddDeveloperAdsForm}
        options={{ title: 'إضافة إعلان مطور', drawerLabel: 'إضافة إعلان مطور' }}
      />
      <Drawer.Screen
        name="AddFinancingAds"
        component={AddAdFin}
        options={{ title: 'إضافة إعلان تمويل', drawerLabel: 'إضافة إعلان تمويل' }}
      />
      <Drawer.Screen
        name="MyAds"
        component={MyAdsScreen}
        options={{ title: 'عرض إعلاناتي', drawerLabel: 'عرض إعلاناتي' }}
      />
      <Drawer.Screen
        name="About"
        component={AboutUsScreen}
        options={{ title: 'من نحن', drawerLabel: 'من نحن' }}
      />
      <Drawer.Screen
        name="Favorite"
        component={FavoritesScreen}
        options={{ title: 'المفضلة', drawerLabel: 'المفضلة' }}
      />
      <Drawer.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: 'الملف الشخصي', drawerLabel: 'الملف الشخصي' }}
      />
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="AddAds" component={ModernRealEstateForm} options={{ title: 'إضافة إعلان عميل' }} />
      <Drawer.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} options={{ title: 'مراجعة بيانات العميل' }} />
      <Drawer.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} options={{ title: 'مراجعة بيانات المطور' }} />
      <Drawer.Screen name="FinancingRequest" component={FinancingRequest} options={{ title: 'طلب تمويل' }} />
      <Stack.Screen name="displayInfo" component={DisplayDataScreenFinicingRequst} />
      <Stack.Screen name="detailsForFinancingAds" component={DetailsForFinancingAds} />
      <Stack.Screen name="DevelopmentDetails" component={DetailsForDevelopment} />
      <Stack.Screen name="ClientDetails" component={DetailsForClient} />
    </Drawer.Navigator>
  );
}

// التطبيق الرئيسي
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer screenOptions={{ headerShown: false }}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} screenOptions={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} screenOptions={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterStack} screenOptions={{ headerShown: false }} />
          <Stack.Screen name="MainApp" component={AppDrawer} screenOptions={{ headerShown: false }} />
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