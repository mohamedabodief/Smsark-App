import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
export default function Advertise() {
  const [userType, setUserType] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
  
    const fetchUserType = async () => {
     
      const user = { id: 'test-user', type_of_user: 'developer' }; // client | developer | financer | admin | organization
      if (user) {
        setUserType(user.type_of_user);
      }
    };

    fetchUserType();
  }, []);

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
    if (!userType) {
      Alert.alert('تنبيه', 'يرجى تسجيل الدخول أولاً');
      return;
    }

    if (userType === 'admin') {
      navigation.navigate(item.route);
    } else if (userType === 'organization') {
      if (item.type === 'developer') {
        navigation.navigate('AddDeveloperAds');
      } else if (item.type === 'financer') {
        navigation.navigate('AddFinancingAd');
      } else {
        Alert.alert('غير مسموح', 'غير مسموح للمُنظمات بإضافة إعلانات العملاء');
      }
    } else if (userType === item.type) {
      navigation.navigate(item.route);
    } else {
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
