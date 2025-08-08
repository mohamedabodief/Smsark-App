import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import FinancingAdvertisement from '../../../FireBase/modelsWithOperations/FinancingAdvertisement';
import ClientAdvertisement from '../../../FireBase/modelsWithOperations/ClientAdvertisement';
import FavoriteButton from '../../Homeparts/FavoriteButton';
import Layout from '../../Layout';
const FavoritesScreen = () => {
  const favoriteItems = useSelector((state) => state.favorites.list);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAds = async () => {
      const cleanedItems = favoriteItems.filter((item) => item?.advertisement_id);
      const results = await Promise.all(
        cleanedItems.map(async ({ advertisement_id }) => {
          let ad = await RealEstateDeveloperAdvertisement.getById(advertisement_id);
          if (!ad) ad = await FinancingAdvertisement.getById(advertisement_id);
          if (!ad) ad = await ClientAdvertisement.getById(advertisement_id);
          return ad;
        })
      );
      setAds(results.filter(Boolean));
      setLoading(false);
    };

    if (favoriteItems.length > 0) {
      fetchAds();
    } else {
      setAds([]);
      setLoading(false);
    }
  }, [favoriteItems]);

  const handleCardClick = (item) => {
    if (item.price_start_from !== undefined) {
      navigation.navigate('DevelopmentDetails', { id: item.id });
    } else if (item.start_limit !== undefined) {
      navigation.navigate('detailsForFinancingAds', { id: item.id });
    } else {
      navigation.navigate('ClientDetails', { id: item.id });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>قائمة المفضلة</Text>

        {ads.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد إعلانات محفوظة في المفضلة.</Text>
        ) : (
          ads.map((item, index) => (
            <TouchableOpacity
              key={`${item.id}_${index}`}
              onPress={() => handleCardClick(item)}
              style={styles.card}
            >
              <Image
                source={{ uri: item.images?.[0] || item.image || 'https://via.placeholder.com/300x160' }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.favoriteBtn}>
                <FavoriteButton
                  advertisementId={item.id}
                  type={
                    item.price_start_from !== undefined
                      ? 'developer'
                      : item.start_limit !== undefined
                        ? 'financing'
                        : 'client'
                  }
                />

              </View>

              <View style={styles.content}>
                {item.price_start_from !== undefined && (
                  <>
                    <Text style={styles.price}>
                      {item.price_start_from?.toLocaleString()} - {item.price_end_to?.toLocaleString()} ج.م
                    </Text>
                    <Text style={styles.subtitle}>{item.developer_name}</Text>
                    <Text style={styles.secondary}>
                      {typeof item.location === 'string'
                        ? item.location
                        : `${item.location?.governorate || ''} - ${item.location?.city || ''}`}
                    </Text>

                    <Text>{item.description}</Text>
                  </>
                )}

                {item.start_limit !== undefined && (
                  <>
                    <Text style={styles.price}>
                      {item.start_limit?.toLocaleString()} - {item.end_limit?.toLocaleString()} ج.م
                    </Text>
                    <Text style={styles.subtitle}>{item.org_name}</Text>
                    <Text style={styles.secondary}>{item.financing_model}</Text>
                  </>
                )}

                {item.title && (
                  <>
                    <Text style={styles.subtitle}>{item.title}</Text>
                    <Text style={styles.secondary}>
                      {(item.city?.name || item.city) ?? ''} - {(item.governorate?.name || item.governorate) ?? ''}
                    </Text>
                    <Text>{item.description}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    marginTop: 30,
    fontSize: 16,
  },
  card: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  content: {
    padding: 12,
    direction:'rtl'
  },
  price: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    color: 'gray',
    marginBottom: 6,
  },
});

export default FavoritesScreen;

// // src/screens/FavoritesScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { loadFavoritesAsync } from '../../redux/favoritesSlice';
// import FinancingCard from '../../Homeparts/FinancingCard';
// import DevelopmentCard from '../../Homeparts/DevelopmentCard';
// import Layout from '../../Layout';
// import { useFocusEffect } from '@react-navigation/native';
// import FavoriteButton from '../../Homeparts/FavoriteButton';

// const FavoritesScreen = () => {
//   const dispatch = useDispatch();
//   const favorites = useSelector((state) => state.favorites.list);

//   // 🟡 تحميل الفيفوريت أول ما الصفحة تفتح
//   useEffect(() => {
//     dispatch(loadFavoritesAsync());
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       dispatch(loadFavoritesAsync());
//     }, [])
//   );


//   const renderItem = ({ item }) => {
//      const { advertisement_id } = item;
//     // لو فيه org_name → إعلان تمويلي
//     if (item.org_name !== undefined) {
//       return (
//         <View style={styles.cardWrapper}>
//           <FavoriteButton id={advertisement_id} />
//           <FinancingCard item={item} />
//         </View>
//       );
//     }

//     // لو فيه developer_name → إعلان مطور
//     if (item.developer_name !== undefined) {
//       return (
//         <View style={styles.cardWrapper}>
//           <FavoriteButton id={advertisement_id} />
//           <DevelopmentCard item={item} />
//         </View>
//       );
//     }

//     // لو مش معروف → تجاهل
//     return null;
//   };



//   return (
//     <Layout>
//       <View style={styles.container}>
//         <Text style={styles.title}>إعلاناتك المفضلة</Text>
//         <FlatList
//           data={favorites}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={{ marginLeft: 10 }}
//           ListEmptyComponent={
//             <Text style={styles.empty}>لا يوجد إعلانات مفضلة</Text>
//           }
//         />
//         {/* <FavoriteButton/> */}
//       </View>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 45,
//     backgroundColor: '#fff',
//   },
//   cardWrapper: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 7,
//     textAlign: 'center',
//   },
//   empty: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: 'gray',
//   },
// });

// export default FavoritesScreen;

// // stop_________________________________________