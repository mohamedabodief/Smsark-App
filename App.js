import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ActivityIndicator } from 'react-native-paper'; // تصحيح استيراد ActivityIndicator
import { CommonActions } from '@react-navigation/native';
import { loadFavoritesAsync } from './src/redux/favoritesSlice';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { DarkTheme, LightTheme } from './theme';
import { useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from './screens/LoginAndRegister/ForgotPasswordScreen';

// Screen Components
import LoginScreen from './screens/LoginAndRegister/LoginScreen';
import ForgotPasswordScreen from './screens/LoginAndRegister/ForgotPasswordScreen';
import RegisterStack from './screens/LoginAndRegister/RegisterStack';
import Home from './src/componenents/Home';
import DrawerContent from './src/componenents/DrawerContent';
import FavoritesScreen from './src/componenents/Favorite';
import AboutUsScreen from './src/componenents/aboutUs';
import ProfileScreen from './src/componenents/profile';
import ModernRealEstateForm from './screens/AddAds';
import DisplayInfoAddClientAds from './screens/displayInfoAddClientAds';
import AddDeveloperAdsForm from './screens/AddDeveloperAds';
import DisplayInfoAddDeveloperAds from './screens/displayInfoAddDeveloperAds';
import FinancingRequest from './screens/finicingRequst';
import DisplayDataScreenFinicingRequst from './screens/DisplayDataScreenFinicingRequst';
import DetailsForFinancingAds from './src/componenents/DetailsForFinancingAds';
import DetailsForDevelopment from './src/componenents/DetailsForDevelopmentAds/index';
import DetailsForClient from './src/componenents/DetailsForClient';
import SellPage from './screens/sell';
import DeveloperPage from './screens/developer';
import FinancingPage from './screens/financing';
import AddAdFin from './src/componenents/FinAddAdsForm';
import SearchPage from './screens/SearchPage';
import MyAdsScreen from './screens/showMyAds/showMyAdsClient';
import MyOrders from './screens/MyOrdeers';
import AddFinancingAdFormNative from './screens/FincingRequstAndDiaplay';
import DisplayInfoAddFinancingAds from './screens/displayInfoFincingAds';
import RequestsForAd from './screens/RequestsForAd';
import { auth } from './FireBase/firebaseConfig';
import ContactUsScreen from './screens/ContactWithUs'; // استيراد واحد فقط

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

SplashScreen.preventAutoHideAsync();

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>حدث خطأ: {this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function FormStackNavigator() {
  const { user } = useContext(AuthContext);
  const userId = user && user.uid ? user.uid : 'guest';

  console.log('FormStackNavigator: Rendering with userId:', userId);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DisplayInfoAddClientAds"
        component={DisplayInfoAddClientAds}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="AddDeveloperAds"
        component={AddDeveloperAdsForm}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="DisplayInfoAddDeveloperAds"
        component={DisplayInfoAddDeveloperAds}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="FinancingRequest"
        component={FinancingRequest}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="DisplayDataScreenFinicingRequst"
        component={DisplayDataScreenFinicingRequst}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="ModernRealEstateForm"
        component={ModernRealEstateForm}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="DisplayInfoAddFinancingAds"
        component={DisplayInfoAddFinancingAds}
        initialParams={{ userId }}
      />
    </Stack.Navigator>
  );
}

function MainStackNavigator() {
  const { user } = useContext(AuthContext);
  const userId = user && user.uid ? user.uid : 'guest';

  console.log('MainStackNavigator: Rendering with userId:', userId);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} initialParams={{ userId }} />
      <Stack.Screen name="Sell" component={SellPage} initialParams={{ userId }} />
      <Stack.Screen name="developer" component={DeveloperPage} initialParams={{ userId }} />
      <Stack.Screen name="financing" component={FinancingPage} initialParams={{ userId }} />
      <Stack.Screen name="Search" component={SearchPage} initialParams={{ userId }} />
      <Stack.Screen name="detailsForFinancingAds" component={DetailsForFinancingAds} initialParams={{ userId }} />
      <Stack.Screen name="DevelopmentDetails" component={DetailsForDevelopment} initialParams={{ userId }} />
      <Stack.Screen name="ClientDetails" component={DetailsForClient} initialParams={{ userId }} />
      <Stack.Screen name="AddAds" component={ModernRealEstateForm} initialParams={{ userId }} />
      <Stack.Screen name="FinancingRequest" component={FinancingRequest} initialParams={{ userId }} />
      <Stack.Screen name="DisplayDataScreenFinicingRequst" component={DisplayDataScreenFinicingRequst} initialParams={{ userId }} />
      <Stack.Screen name="MyOrders" component={MyOrders} initialParams={{ userId }} />
      <Stack.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} initialParams={{ userId }} />
      <Stack.Screen name="RequestsForAd" component={RequestsForAd} options={{ title: 'طلبات الإعلان' }} initialParams={{ userId }} />
    </Stack.Navigator>
  );
}

function AppDrawer({ toggleMode }) {
  const { user } = useContext(AuthContext);
  const userId = user && user.uid ? user.uid : 'guest';
  const dispatch = useDispatch();

  console.log('AppDrawer: Rendering with userId:', userId);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(loadFavoritesAsync());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Drawer.Navigator
      initialRouteName="MainStack"
      drawerContent={(props) => <DrawerContent {...props} toggleMode={toggleMode} />}
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
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchPage}
        options={{ title: 'بحث', drawerLabel: 'بحث' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="FormStack"
        component={FormStackNavigator}
        options={{ title: 'النماذج', drawerLabel: 'النماذج والإعلانات' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="AddClientAds"
        component={ModernRealEstateForm}
        options={{ title: 'إضافة إعلان عميل', drawerLabel: 'إضافة إعلان عميل' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="AddDeveloperAds"
        component={AddDeveloperAdsForm}
        options={{ title: 'إضافة إعلان مطور', drawerLabel: 'إضافة إعلان مطور' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="AddFinancingAds"
        component={AddFinancingAdFormNative}
        options={{ title: 'إضافة إعلان تمويل', drawerLabel: 'إضافة إعلان تمويل' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="MyAds"
        component={MyAdsScreen}
        options={{ title: 'إعلاناتي', drawerLabel: 'إعلاناتي' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="About"
        component={AboutUsScreen}
        options={{ title: 'من نحن', drawerLabel: 'من نحن' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="Favorite"
        component={FavoritesScreen}
        options={{ title: 'المفضلة', drawerLabel: 'المفضلة' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{ title: 'تواصل معنا', drawerLabel: 'تواصل معنا' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: 'الملف الشخصي', drawerLabel: 'الملف الشخصي' }}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ title: 'طلباتي', drawerLabel: 'طلباتي' }}
        initialParams={{ userId }}
      />
    </Drawer.Navigator>
  );
}

function AppContent({ navigation, toggleMode }) {
  const { user, loading } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    console.log('AppContent: useEffect - loading:', loading, 'user:', user ? user.uid : 'none');
    if (loading) {
      console.log('AppContent: Still loading, waiting for auth state');
      return;
    }
    if (!user || !user.uid) {
      console.log('AppContent: No user or no uid, setting initialRoute to Login');
      setInitialRoute('Login');
      if (navigation) {
        console.log('AppContent: Resetting navigation to Login');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
        console.log('AppContent: Navigation reset to Login completed');
      }
    } else {
      console.log('AppContent: User exists, setting initialRoute to MainApp');
      setInitialRoute('MainApp');
      if (navigation) {
        console.log('AppContent: Resetting navigation to MainApp');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'MainApp',
                params: { screen: 'MainStack', params: { screen: 'Home' } },
              },
            ],
          })
        );
        console.log('AppContent: Navigation reset to MainApp completed');
      }
    }
  }, [loading, user, navigation]);

  if (loading || initialRoute === null) {
    console.log('AppContent: Showing loading indicator');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  console.log('AppContent: Rendering Stack.Navigator with initialRouteName:', initialRoute);

  return (
    <ErrorBoundary>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Register" component={RegisterStack} />
        <Stack.Screen name="MainApp">
          {(props) => <AppDrawer {...props} toggleMode={toggleMode} />}
        </Stack.Screen>
        <Stack.Screen name="detailsForFinancingAds" component={DetailsForFinancingAds} />
        <Stack.Screen name="DevelopmentDetails" component={DetailsForDevelopment} />
        <Stack.Screen name="ClientDetails" component={DetailsForClient} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(scheme === 'dark');

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'), 
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
  });

  const toggleMode = () => setIsDarkMode((prev) => !prev);

  const fontConfig = {
    ios: {
      regular: { fontFamily: 'Roboto-Regular', fontWeight: 'normal' },
      medium: { fontFamily: 'Roboto-Medium', fontWeight: 'normal' },
      light: { fontFamily: 'Roboto-Light', fontWeight: 'normal' },
      thin: { fontFamily: 'Roboto-Thin', fontWeight: 'normal' },
    },
    android: {
      regular: { fontFamily: 'Roboto-Regular', fontWeight: 'normal' },
      medium: { fontFamily: 'Roboto-Medium', fontWeight: 'normal' },
      light: { fontFamily: 'Roboto-Light', fontWeight: 'normal' },
      thin: { fontFamily: 'Roboto-Thin', fontWeight: 'normal' },
    },
  };

  const paperTheme = {
    ...(isDarkMode ? DarkTheme : LightTheme),
    fonts: configureFonts({ config: fontConfig }),
  };

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer theme={isDarkMode ? NavigationDarkTheme : NavigationLightTheme}>
            <StatusBar style="auto" />
            <AppContent toggleMode={toggleMode} />
            <Toast config={toastConfig} />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});