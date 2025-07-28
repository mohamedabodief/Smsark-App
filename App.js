// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { loadFavoritesAsync } from './src/redux/favoritesSlice';
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
// Main Components
import Home from './src/componenents/Home';
import DrawerContent from './src/componenents/DrawerContent';
import FavoritesScreen from './src/componenents/Favorite';
import AboutUsScreen from './src/componenents/aboutUs';

// Form Components
import AddAdForm from './src/componenents/ClientAddAdsForm';
import AddAdvDev from './src/componenents/devAddAdsForm';
import AddAdFin from './src/componenents/FinAddAdsForm';
import ProfileScreen from './src/componenents/profile';
import DetailsForFinancingAds from './src/componenents/DetailsForFinancingAds/index.js';
import DetailsForDevelopment from './src/componenents/DetailsForDevelopmentAds/index.js';
import DetailsForClient from './src/componenents/DetailsForClient/index.js';
import SellPage from './screens/sell.jsx';
import DeveloperPage from './screens/developer.jsx';
import FinancingPage from './screens/financing.jsx';
import ModernDeveloperForm from './screens/AddDeveloperAds.jsx';
// import seed from './src/Homeparts/addfakedata/index.js';
// import RealEstateDeveloperAdvertisement from './FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement.js';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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
      <Stack.Screen name="AddDeveloperAds" component={ModernDeveloperForm} />
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
      <Stack.Screen name="Sell" component={SellPage} />
      <Stack.Screen name="Developer" component={DeveloperPage} />
      <Stack.Screen name="Financing" component={FinancingPage} />
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
       <Drawer.Screen 
          name="Search" 
          component={SearchPage}
          options={{ 
            title: 'بحث',
            drawerLabel: 'بحث'
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
          component={ModernRealEstateForm}
          options={{ 
            title: 'إضافة إعلان عميل',
            drawerLabel: 'إضافة إعلان عميل'
          }} 
        />
        <Drawer.Screen 
          name="AddDeveloperAds" 
          component={ModernDeveloperForm}
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
          name="profile" 
          component={ProfileScreen}
          options={{ 
            title: 'الملف الشخصي',
            drawerLabel: 'الملف الشخصي'
          }} 
        />
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="AddAds" component={ModernRealEstateForm} options={{ title: 'إضافة إعلان عميل' }} />
        <Drawer.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} options={{ title: 'مراجعة بيانات العميل' }} />
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

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
