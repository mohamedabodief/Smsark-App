// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { loadFavoritesAsync } from './src/redux/favoritesSlice';

// Main Components
import Home from './src/componenents/Home';
import DrawerContent from './src/componenents/DrawerContent';
import FavoritesScreen from './src/componenents/Favorite';
import AboutUsScreen from './src/componenents/aboutUs';
import ProfileScreen from './src/componenents/profile';

// Form Components
import AddAdForm from './src/componenents/ClientAddAdsForm';
import AddAdvDev from './src/componenents/devAddAdsForm';
import AddAdFin from './src/componenents/FinAddAdsForm';

// Screen Components
import DisplayInfoAddClientAds from './screens/displayInfoAddClientAds.jsx';
import AddDeveloperAdsForm from './screens/AddDeveloperAds.jsx';
import DisplayInfoAddDeveloperAds from './screens/displayInfoAddDeveloperAds.jsx';
import FinancingRequest from './screens/finicingRequst.jsx';
import DisplayDataScreenFinicingRequst from './screens/DisplayDataScreenFinicingRequst.jsx';
import ModernRealEstateForm from './screens/AddAds.jsx';
import SellScreen from './screens/sell.jsx';
import DeveloperScreen from './screens/developer.jsx';
import FinancingScreen from './screens/financing.jsx';
import SearchPage from './screens/SearchPage.jsx';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Form-related screens
function FormStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} />
      <Stack.Screen name="AddDeveloperAdsForm" component={AddDeveloperAdsForm} />
      <Stack.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} />
      <Stack.Screen name="FinancingRequest" component={FinancingRequest} />
      <Stack.Screen name="DisplayFinancingInfo" component={DisplayDataScreenFinicingRequst} />
      <Stack.Screen name="ModernRealEstateForm" component={ModernRealEstateForm} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Main screens
function MainStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Sell" component={SellScreen} />
      <Stack.Screen name="Developer" component={DeveloperScreen} />
      <Stack.Screen name="Financing" component={FinancingScreen} />
      <Stack.Screen name="Search" component={SearchPage} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFavoritesAsync());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="MainStack"
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{ 
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#f6f6f6',
            width: 280,
          },
          drawerActiveTintColor: '#f4511e',
          drawerInactiveTintColor: '#333',
        }}
      >
        {/* Main Navigation */}
        <Drawer.Screen 
          name="MainStack" 
          component={MainStackNavigator}
          options={{ 
            title: 'الرئيسية',
            drawerLabel: 'الرئيسية'
          }} 
        />
        
        {/* Form Navigation */}
        <Drawer.Screen 
          name="FormStack" 
          component={FormStackNavigator}
          options={{ 
            title: 'النماذج',
            drawerLabel: 'النماذج والإعلانات'
          }} 
        />
        
        {/* Direct Drawer Screens */}
        <Drawer.Screen 
          name="AddClientAds" 
          component={AddAdForm}
          options={{ 
            title: 'إضافة إعلان عميل',
            drawerLabel: 'إضافة إعلان عميل'
          }} 
        />
        <Drawer.Screen 
          name="AddDeveloperAds" 
          component={AddAdvDev}
          options={{ 
            title: 'إضافة إعلان مطور',
            drawerLabel: 'إضافة إعلان مطور'
          }} 
        />
        <Drawer.Screen 
          name="AddFinancingAds" 
          component={AddAdFin}
          options={{ 
            title: 'إضافة إعلان تمويل',
            drawerLabel: 'إضافة إعلان تمويل'
          }} 
        />
        <Drawer.Screen 
          name="About" 
          component={AboutUsScreen}
          options={{ 
            title: 'من نحن',
            drawerLabel: 'من نحن'
          }} 
        />
        <Drawer.Screen 
          name="Favorite" 
          component={FavoritesScreen}
          options={{ 
            title: 'المفضلة',
            drawerLabel: 'المفضلة'
          }} 
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ 
            title: 'الملف الشخصي',
            drawerLabel: 'الملف الشخصي'
          }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
