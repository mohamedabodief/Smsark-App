import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';
import { auth } from '../../../FireBase/firebaseConfig';
import User from '../../../FireBase/modelsWithOperations/User';
import Layout from '../../Layout';
const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUserUid = auth.currentUser?.uid;
        if (!currentUserUid) return;
        const user = await User.getByUid(currentUserUid);
        setUserData(user);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text>لم يتم العثور على بيانات المستخدم.</Text>
      </View>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {userData.image ? (
            <Image source={{ uri: userData.image }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>👤</Text>
            </View>
          )}

          {userData.type_of_user === 'client' && (
            <>
              <Text style={styles.info}>👤 الاسم: {userData.cli_name}</Text>
              <Text style={styles.info}>🎂 العمر: {userData.age}</Text>
              <Text style={styles.info}>🚻 الجنس: {userData.gender}</Text>
            </>
          )}
          {userData.type_of_user === 'organization' && (
            <>
              <Text style={styles.userType}> {userData.org_name}</Text>
              <Text style={styles.info}>🏢 النوع الحساب: {userData.type_of_user}</Text>
              <Text style={styles.info}>📄 نوع المؤسسة: {userData.type_of_organization}</Text>
            </>
          )}
          {userData.type_of_user === 'admin' && (
            <Text style={styles.info}>👑 الاسم: {userData.adm_name}</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.info}>
            📞 رقم الهاتف: <Text style={styles.phone}>{userData.phone}</Text>
          </Text>

          <Text style={styles.info}>📍 المحافظة: {userData.governorate}</Text>
          <Text style={styles.info}>🏙️ المدينة: {userData.city}</Text>
          <Text style={styles.info}>🏠 العنوان: {userData.address}</Text>
        </View>
      </ScrollView>
    </Layout>
  );
}
export default ProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    paddingTop: 55,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'flex-start',
    flexDirection: 'column',
    direction: 'rtl',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#f4511e',
    alignSelf: 'center',
  },
  placeholderImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',

  },
  placeholderText: {
    fontSize: 42,
    color: '#888',
  },
  userType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6E00FE',
    marginBottom: 27,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  info: {
    fontSize: 18,
    color: '#444',
    marginVertical: 4,
    textAlign: 'left',
    alignSelf: 'stretch',
    paddingBottom: 6,
  },
  phone: {
    fontSize: 24,
    // fontWeight: 'bold',
    // color: '#000',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
});
