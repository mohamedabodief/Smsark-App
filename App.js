import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
       <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AddAds" component={ModernRealEstateForm} options={{ title: 'إضافة إعلان عميل' }} />
          <Stack.Screen name="DisplayInfoAddClientAds" component={DisplayInfoAddClientAds} options={{ title: 'مراجعة بيانات العميل' }} />
          <Stack.Screen name="AddDeveloperAds" component={AddDeveloperAdsForm} options={{ title: 'إضافة إعلان مطور' }} />
          <Stack.Screen name="DisplayInfoAddDeveloperAds" component={DisplayInfoAddDeveloperAds} options={{ title: 'مراجعة بيانات المطور' }} />
          <Stack.Screen name="FinancingRequest" component={FinancingRequest} options={{ title: 'طلب تمويل' }} />
          <Stack.Screen name="displayInfo" component={DisplayDataScreenFinicingRequst} />
        </Stack.Navigator>
      </NavigationContainer> 
      {/* <SearchPage/> */}
       {/* <SellPage/>  */}
      {/* <DeveloperPage/> */}
      {/* <FinancingPage/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
