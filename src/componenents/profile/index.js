import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
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
        // console.log("✅ Current User UID:", currentUserUid);
        const user = await User.getByUid(currentUserUid);
        setUserData(user);
      } catch (err) {
        console.error('❌ Error fetching user data:', err.message);
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
      <View style={styles.container}>
        {userData.image ? (
          <Image source={{ uri: userData.image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>👤</Text>
          </View>
        )}
        <Text style={styles.label}>النوع: {userData.type_of_user}</Text>

        {userData.type_of_user === 'client' && (
          <>
            <Text style={styles.info}>الاسم: {userData.cli_name}</Text>
            <Text style={styles.info}>العمر: {userData.age}</Text>
            <Text style={styles.info}>الجنس: {userData.gender}</Text>
          </>
        )}
        {userData.type_of_user === 'organization' && (
          <>
            <Text style={styles.info}>اسم المؤسسة: {userData.org_name}</Text>
            <Text style={styles.info}>نوع المؤسسة: {userData.type_of_organization}</Text>
          </>
        )}
        {userData.type_of_user === 'admin' && (
          <Text style={styles.info}>الاسم: {userData.adm_name}</Text>
        )}

        <Text style={styles.info}>📞 رقم الهاتف: {userData.phone}</Text>
        <Text style={styles.info}>📍 المحافظة: {userData.governorate}</Text>
        <Text style={styles.info}>🏙️ المدينة: {userData.city}</Text>
        <Text style={styles.info}>🏠 العنوان: {userData.address}</Text>
      </View>
    </Layout>
  );

};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f4511e',
  },
  placeholderImage: {
    width: 90,
    height: 90,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
    color: '#888',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555',
  },
});
