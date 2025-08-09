import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../../FireBase/firebaseConfig';
import { collection, query, where, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Layout from '../../src/Layout';
import ClientAdvertisement from '../../FireBase/modelsWithOperations/ClientAdvertisement';
import SearchCard from '../components/SearchCard';

const MyAdsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [userType, setUserType] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [deletingAdId, setDeletingAdId] = useState(null);

  // جلب نوع المستخدم من Firestore
  const fetchUserType = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert('خطأ', 'المستخدم غير مسجل دخول', [
          { text: 'حسناً', onPress: () => navigation.navigate('Login') }
        ]);
        setLoading(false);
        return;
      }
      const userDoc = await getDocs(
        query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid))
      );
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setUserType(userData.userType || 'client');
      } else {
        setUserType('client');
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل في جلب بيانات المستخدم: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      setUserType('client');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert('خطأ', 'المستخدم غير مسجل دخول', [
          { text: 'حسناً', onPress: () => navigation.navigate('Login') }
        ]);
        setLoading(false);
        return;
      }
      let ads = [];

      if (userType === 'client') {
        const clientAds = await ClientAdvertisement.getByUserId(auth.currentUser.uid);
        ads = [...ads, ...clientAds.map(ad => ({
          id: ad.id,
          title: ad.title || 'بدون عنوان',
          price: ad.price ? `${ad.price}` : 'غير محدد',
          city: ad.city || 'غير محدد',
          type: ad.type || 'غير محدد',
          images: ad.images && ad.images.length > 0 
            ? ad.images 
            : ['https://via.placeholder.com/150?text=Default+Property+Image'],
          source: 'client',
          ...ad,
        }))];
      }

      if (userType === 'organization') {
        const financingAdsQuery = query(
          collection(db, 'FinancingAdvertisements'),
          where('userId', '==', auth.currentUser.uid)
        );
        const financingAdsSnapshot = await getDocs(financingAdsQuery);
        ads = [...ads, ...financingAdsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || 'بدون عنوان',
          price: doc.data().price ? `${doc.data().price}` : 'غير محدد',
          city: doc.data().city || 'غير محدد',
          type: doc.data().type || 'تمويل',
          images: doc.data().images && doc.data().images.length > 0 
            ? doc.data().images 
            : ['https://via.placeholder.com/150?text=Default+Property+Image'],
          source: 'financing',
          ...doc.data(),
        }))];
        const developerAdsQuery = query(
          collection(db, 'RealEstateDeveloperAdvertisements'),
          where('userId', '==', auth.currentUser.uid)
        );
        const developerAdsSnapshot = await getDocs(developerAdsQuery);
        ads = [...ads, ...developerAdsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().developer_name || 'بدون عنوان',
          price: doc.data().price_start_from && doc.data().price_end_to 
            ? `${doc.data().price_start_from} - ${doc.data().price_end_to}` 
            : 'غير محدد',
          city: doc.data().location || 'غير محدد',
          type: doc.data().project_types || 'عقار مطور',
          images: doc.data().images && doc.data().images.length > 0 
            ? doc.data().images 
            : ['https://via.placeholder.com/150?text=Default+Property+Image'],
          source: 'developer',
          ...doc.data(),
        }))];
      }
      setAdvertisements(ads);
      setLoading(false);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في جلب الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      setLoading(false);
    }
  };

  // دالة حذف الإعلان
  const handleDeleteAd = async (id, source) => {
    setDeletingAdId(id);
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذا الإعلان؟',
      [
        { text: 'إلغاء', style: 'cancel', onPress: () => setDeletingAdId(null) },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              // تحديد المجموعة بناءً على source
              let collectionName;
              let storagePathPrefix;
              if (source === 'client') {
                collectionName = 'ClientAdvertisements';
                storagePathPrefix = 'client_ads';
              } else if (source === 'financing') {
                collectionName = 'FinancingAdvertisements';
                storagePathPrefix = 'financing_ads';
              } else if (source === 'developer') {
                collectionName = 'RealEstateDeveloperAdvertisements';
                storagePathPrefix = 'developer_ads';
              } else {
                throw new Error('نوع الإعلان غير معروف');
              }

              // العثور على الإعلان في حالة advertisements
              const ad = advertisements.find(ad => ad.id === id && ad.source === source);
              if (!ad) {
                throw new Error('الإعلان غير موجود في القائمة');
              }

       
              if (Array.isArray(ad.images) && ad.images.length > 0) {
                await Promise.all(ad.images.map(async (image, i) => {
                  const imageRef = ref(storage, `${storagePathPrefix}/${auth.currentUser.uid}/${id}/image_${i}.jpg`);
                  try {
                    await deleteObject(imageRef);
                  } catch (error) {
                  
                  }
                }));
              }

          
              const adRef = doc(db, collectionName, id);
              await deleteDoc(adRef);
              setAdvertisements(prev => prev.filter(ad => ad.id !== id));
              Alert.alert('نجاح', 'تم حذف الإعلان بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في حذف الإعلان: ' + (error.message || 'يرجى المحاولة لاحقاً'));
            } finally {
              setDeletingAdId(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!auth.currentUser || !userType) return;
    
    let unsubscribeFinancing = () => {};
    let unsubscribeDeveloper = () => {};

    if (userType === 'organization') {
      const financingAdsQuery = query(
        collection(db, 'FinancingAdvertisements'),
        where('userId', '==', auth.currentUser.uid)
      );
      unsubscribeFinancing = onSnapshot(financingAdsQuery, (snapshot) => {
        const updatedAds = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || 'بدون عنوان',
          price: doc.data().price ? `${doc.data().price}` : 'غير محدد',
          city: doc.data().city || 'غير محدد',
          type: doc.data().type || 'تمويل',
          images: doc.data().images && doc.data().images.length > 0 
            ? doc.data().images 
            : ['https://via.placeholder.com/150?text=Default+Property+Image'],
          source: 'financing',
          ...doc.data(),
        }));
        setAdvertisements(prev => {
          const otherAds = prev.filter(ad => ad.source !== 'financing');
          return [...otherAds, ...updatedAds];
        });
      }, (error) => {
        Alert.alert('خطأ', 'فشل في مزامنة الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      });
      const developerAdsQuery = query(
        collection(db, 'RealEstateDeveloperAdvertisements'),
        where('userId', '==', auth.currentUser.uid)
      );
      unsubscribeDeveloper = onSnapshot(developerAdsQuery, (snapshot) => {
        const updatedAds = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().developer_name || 'بدون عنوان',
          price: doc.data().price_start_from && doc.data().price_end_to 
            ? `${doc.data().price_start_from} - ${doc.data().price_end_to}` 
            : 'غير محدد',
          city: doc.data().location || 'غير محدد',
          type: doc.data().project_types || 'عقار مطور',
          images: doc.data().images && doc.data().images.length > 0 
            ? doc.data().images 
            : ['https://via.placeholder.com/150?text=Default+Property+Image'],
          source: 'developer',
          ...doc.data(),
        }));
        setAdvertisements(prev => {
          const otherAds = prev.filter(ad => ad.source !== 'developer');
          return [...otherAds, ...updatedAds];
        });
      }, (error) => {
        Alert.alert('خطأ', 'فشل في مزامنة الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      });
    }

    if (userType === 'client') {
      const clientAdsQuery = query(
        collection(db, 'ClientAdvertisements'),
        where('userId', '==', auth.currentUser.uid)
      );
      const unsubscribeClient = onSnapshot(clientAdsQuery, (snapshot) => {
        const updatedAds = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || 'بدون عنوان',
          price: doc.data().price ? `${doc.data().price}` : 'غير محدد',
          city: doc.data().city || 'غير محدد',
          type: doc.data().type || 'غير محدد',
          images: doc.data().images && doc.data().images.length > 0 
            ? doc.data().images 
            : ['https://via.placeholder.com/150?text=Default+Property+Image'],
          source: 'client',
          ...doc.data(),
        }));
        setAdvertisements(prev => {
          const otherAds = prev.filter(ad => ad.source !== 'client');
          return [...otherAds, ...updatedAds];
        });
      }, (error) => {
        Alert.alert('خطأ', 'فشل في مزامنة الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      });
      return () => {
        unsubscribeClient();
      };
    }

    return () => {
      unsubscribeFinancing();
      unsubscribeDeveloper();
    };
  }, [userType]);

  useEffect(() => {
    fetchUserType();
  }, []);

  useEffect(() => {
    if (userType !== null) {
      fetchAdvertisements();
    }
  }, [userType, refresh]);

  useEffect(() => {
    if (route.params?.newAd) {
      setRefresh(prev => !prev);
    }
  }, [route.params?.newAd]);

  const renderAdItem = ({ item }) => (
    <SearchCard
      name={item.title || 'بدون عنوان'}
      price={item.price || 'غير محدد'}
      imageUrl={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150?text=Default+Property+Image'}
      location={item.city || 'غير محدد'}
      type={item.type || 'غير محدد'}
      navigation={navigation} 
      id={item.id}
      source={item.source}
      showDelete={true}
      showHeart={false}
      isDeleting={deletingAdId === item.id}
      onDelete={handleDeleteAd}
      showRequestsButton={true}
      {...item}
    />
  );

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4D00B1" />
          <Text style={styles.loadingText}>جاري تحميل الإعلانات...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>إعلاناتي</Text>
        </View>
        {advertisements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد إعلانات لعرضها</Text>
          </View>
        ) : (
          <FlatList
            data={advertisements}
            renderItem={renderAdItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4D00B1',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4D00B1',
    writingDirection: 'rtl',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    writingDirection: 'rtl',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default MyAdsScreen;