import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../FireBase/firebaseConfig';

export default function Advertise() {
  const [userType, setUserType] = useState(null);
  const [organizationType, setOrganizationType] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!user || !user.uid) {
        console.log('Advertise: No user logged in');
        setUserType(null);
        return;
      }

      try {
        console.log('Advertise: Fetching user data for UID:', user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Advertise: User data fetched:', userData);
          setUserType(userData.type_of_user);
          if (userData.type_of_user === 'organization') {
            setOrganizationType(userData.type_of_organization || null);
            console.log('Advertise: Organization type:', userData.type_of_organization);
          }
        } else {
          console.log('Advertise: User document does not exist');
          setUserType(null);
        }
      } catch (error) {
        console.error('Advertise: Error fetching user data:', error);
        setUserType(null);
      }
    };

    fetchUserType();
  }, [user]);

  const options = [
    {
      icon: 'magnify',
      title: 'عميل؟',
      description: 'استكشف أفضل العقارات المتاحة بسهولة ويسر.',
      type: 'client',
      route: 'AddAds',
    },
    {
      icon: 'home-city',
      title: 'مطور؟',
      description: 'أضف عقارك الآن وابدأ في تلقي العروض بسهولة.',
      type: 'developer',
      route: 'AddDeveloperAds',
    },
    {
      icon: 'office-building',
      title: 'ممول؟',
      description: 'قم بإدارة مشاريعك وتواصل مع المهتمين بعقاراتك.',
      type: 'financer',
      route: 'AddFinancingAds',
    },
  ];

  const handleNavigate = (item) => {
    console.log('Advertise: handleNavigate called with item:', item, 'userType:', userType, 'organizationType:', organizationType);

    if (!user || !userType) {
      console.log('Advertise: No user or userType, redirecting to Login');
      Alert.alert('تنبيه', 'يرجى تسجيل الدخول أولاً', [
        { text: 'موافق', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (userType === 'admin') {
      console.log('Advertise: Admin user, navigating to', item.route);
      navigation.navigate(item.route);
    } else if (userType === 'organization') {
      if (['ممول عقاري', 'ممول عقارى'].includes(organizationType) && item.type === 'financer') {
        console.log('Advertise: Organization (ممول عقاري/عقارى) user, navigating to AddFinancingAds');
        navigation.navigate('AddFinancingAds');
      } else if (['مطور عقاري', 'مطور عقارى'].includes(organizationType) && item.type === 'developer') {
        console.log('Advertise: Organization (مطور عقاري/عقارى) user, navigating to AddDeveloperAds');
        navigation.navigate('AddDeveloperAds');
      } else {
        console.log(`Advertise: Access denied for organization type ${organizationType} to ${item.route}`);
        Alert.alert('غير مصرح', 'غير مصرح لك بالدخول لهذا القسم');
      }
    } else if (userType === item.type) {
      console.log(`Advertise: ${userType} user, navigating to`, item.route);
      navigation.navigate(item.route);
    } else {
      console.log(`Advertise: Access denied for userType ${userType} to ${item.route}`);
      Alert.alert('غير مصرح', 'غير مصرح لك بالدخول لهذا القسم');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>أعلن عن عقارك</Text>
      {options.map((item, index) => (
        <View key={index} style={styles.card}>
          <Avatar.Icon
            icon={item.icon}
            size={70}
            style={{ alignSelf: 'center', backgroundColor: '#f0f0f0' }}
            color="#1976d2"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate(item)}>
            <Text style={styles.buttonText}>أضف إعلانك</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    color: 'gray',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});