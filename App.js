import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import User from './FireBase/modelsWithOperations/User';

export default function App() {
  console.log(
    '🔥 API Key from .env:',
    Constants.expoConfig.extra.FIREBASE_API_KEY
  );

  User.getAllUsers()
    .then((users) => {
      console.log('🔥 All Users:', users);
    })
    .catch((error) => {
      console.error('🔥 Error fetching users:', error);
    });

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
