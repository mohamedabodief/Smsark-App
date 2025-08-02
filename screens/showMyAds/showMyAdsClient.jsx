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
        console.error('No authenticated user found');
        Alert.alert('خطأ', 'المستخدم غير مسجل دخول', [
          { text: 'حسناً', onPress: () => navigation.navigate('Login') }
        ]);
        setLoading(false);
        return;
      }
      console.log('Current auth user:', auth.currentUser);
      console.log('Fetching user type for UID:', auth.currentUser.uid);
      const userDoc = await getDocs(
        query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid))
      );
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        console.log('User data:', userData);
        setUserType(userData.userType || 'client');
      } else {
        console.warn('No user document found, assuming client');
        setUserType('client');
      }
    } catch (error) {
      console.error('Error fetching user type:', error.message || error);
      Alert.alert('خطأ', 'فشل في جلب بيانات المستخدم: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      setUserType('client');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        Alert.alert('خطأ', 'المستخدم غير مسجل دخول', [
          { text: 'حسناً', onPress: () => navigation.navigate('Login') }
        ]);
        setLoading(false);
        return;
      }

      console.log('Fetching advertisements for UID:', auth.currentUser.uid, 'with userType:', userType);
      let ads = [];

      if (userType === 'client') {
        console.log('Using ClientAdvertisement class to fetch ads');
        const clientAds = await ClientAdvertisement.getByUserId(auth.currentUser.uid);
        console.log('Client ads fetched:', clientAds);
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
        console.log('Querying FinancingAdvertisements');
        const financingAdsQuery = query(
          collection(db, 'FinancingAdvertisements'),
          where('userId', '==', auth.currentUser.uid)
        );
        const financingAdsSnapshot = await getDocs(financingAdsQuery);
        console.log('Financing ads found:', financingAdsSnapshot.size, 'data:', financingAdsSnapshot.docs.map(doc => doc.data()));
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

        console.log('Querying RealEstateDeveloperAdvertisements');
        const developerAdsQuery = query(
          collection(db, 'RealEstateDeveloperAdvertisements'),
          where('userId', '==', auth.currentUser.uid)
        );
        const developerAdsSnapshot = await getDocs(developerAdsQuery);
        console.log('Developer ads found:', developerAdsSnapshot.size, 'data:', developerAdsSnapshot.docs.map(doc => doc.data()));
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

      console.log('Total advertisements fetched:', ads.length, 'ads:', ads);
      setAdvertisements(ads);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching advertisements:', error.message || error);
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
                    console.log(`Deleted image: ${storagePathPrefix}/${auth.currentUser.uid}/${id}/image_${i}.jpg`);
                  } catch (error) {
                    console.warn(`Failed to delete image ${i}: ${error.message}`);
                  }
                }));
              }

          
              const adRef = doc(db, collectionName, id);
              await deleteDoc(adRef);
              console.log(`Deleted ad ${id} from ${collectionName}`);
              setAdvertisements(prev => prev.filter(ad => ad.id !== id));
              Alert.alert('نجاح', 'تم حذف الإعلان بنجاح');
            } catch (error) {
              console.error('Error deleting ad:', error.message || error);
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

    console.log('Setting up onSnapshot for advertisements, userType:', userType);
    
    let unsubscribeFinancing = () => {};
    let unsubscribeDeveloper = () => {};

    if (userType === 'organization') {
      console.log('Setting up onSnapshot for FinancingAdvertisements');
      const financingAdsQuery = query(
        collection(db, 'FinancingAdvertisements'),
        where('userId', '==', auth.currentUser.uid)
      );
      unsubscribeFinancing = onSnapshot(financingAdsQuery, (snapshot) => {
        console.log('Financing onSnapshot triggered, changes detected:', snapshot.docChanges().length);
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
        console.error('Financing onSnapshot error:', error.message || error);
        Alert.alert('خطأ', 'فشل في مزامنة الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      });

      console.log('Setting up onSnapshot for RealEstateDeveloperAdvertisements');
      const developerAdsQuery = query(
        collection(db, 'RealEstateDeveloperAdvertisements'),
        where('userId', '==', auth.currentUser.uid)
      );
      unsubscribeDeveloper = onSnapshot(developerAdsQuery, (snapshot) => {
        console.log('Developer onSnapshot triggered, changes detected:', snapshot.docChanges().length);
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
        console.error('Developer onSnapshot error:', error.message || error);
        Alert.alert('خطأ', 'فشل في مزامنة الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      });
    }

    if (userType === 'client') {
      console.log('Setting up onSnapshot for ClientAdvertisements');
      const clientAdsQuery = query(
        collection(db, 'ClientAdvertisements'),
        where('userId', '==', auth.currentUser.uid)
      );
      const unsubscribeClient = onSnapshot(clientAdsQuery, (snapshot) => {
        console.log('Client onSnapshot triggered, changes detected:', snapshot.docChanges().length);
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
        console.error('Client onSnapshot error:', error.message || error);
        Alert.alert('خطأ', 'فشل في مزامنة الإعلانات: ' + (error.message || 'يرجى المحاولة لاحقاً'));
      });
      return () => {
        console.log('Cleaning up onSnapshot subscriptions');
        unsubscribeClient();
      };
    }

    return () => {
      console.log('Cleaning up onSnapshot subscriptions');
      unsubscribeFinancing();
      unsubscribeDeveloper();
    };
  }, [userType]);

  useEffect(() => {
    console.log('MyAdsScreen useEffect triggered');
    fetchUserType();
  }, []);

  useEffect(() => {
    if (userType !== null) {
      console.log('userType set to:', userType);
      fetchAdvertisements();
    }
  }, [userType, refresh]);

  useEffect(() => {
    if (route.params?.newAd) {
      console.log('New ad detected, refreshing advertisements');
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