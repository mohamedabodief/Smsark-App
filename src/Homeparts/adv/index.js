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
        setUserType(null);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserType(userData.type_of_user);
          if (userData.type_of_user === 'organization') {
            setOrganizationType(userData.type_of_organization || null);
          }
        } else {
          setUserType(null);
        }
      } catch (error) {
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
  
    if (!user || !userType) {
      Alert.alert('تنبيه', 'يرجى تسجيل الدخول أولاً', [
        { text: 'موافق', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (userType === 'admin') {
      navigation.navigate(item.route);
      return;
    }

    if (userType === 'organization') {
      if (item.type === 'client') {
        Alert.alert('غير مصرح', 'غير مصرح لك بالدخول سجل كعميل حتى تتمكن من الدخول ');
        return;
      }
      if (['ممول عقاري', 'ممول عقارى'].includes(organizationType) && item.type === 'financer') {
        navigation.navigate('AddFinancingAds');
        return;
      } else if (['مطور عقاري', 'مطور عقارى'].includes(organizationType) && item.type === 'developer') {
        navigation.navigate('AddDeveloperAds');
        return;
      } else {
        const alertMessage = item.type === 'developer' ? 'غير مصرح لك بالدخول سجل كمطور حتى تتمكن من الدخول' : 'غير مصرح لك بالدخول سجل كممول حتى تتمكن من الدخول';
        Alert.alert('غير مصرح', alertMessage);
        return;
      }
    }

    if (userType === item.type) {
      navigation.navigate(item.route);
    } else {
      const alertMessage = item.type === 'developer' ? 'غير مسموح لك بالدخول سجل كمطور حتى تتمكن من الدخول' : 'غير مسموح لك بالدخول سجل كممول حتى تتمكن من الدخول';
      Alert.alert('غير مصرح', alertMessage);
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