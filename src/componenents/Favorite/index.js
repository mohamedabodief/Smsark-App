// src/screens/FavoritesScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadFavoritesAsync } from '../../redux/favoritesSlice';
import FinancingCard from '../../Homeparts/FinancingCard';
import DevelopmentCard from '../../Homeparts/DevelopmentCard';
import Layout from '../../Layout';
import { useFocusEffect } from '@react-navigation/native';
import FavoriteButton from '../../Homeparts/FavoriteButton';

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.list);

  // 🟡 تحميل الفيفوريت أول ما الصفحة تفتح
  useEffect(() => {
    dispatch(loadFavoritesAsync());
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(loadFavoritesAsync());
    }, [])
  );


  const renderItem = ({ item }) => {
     const { advertisement_id } = item;
    // لو فيه org_name → إعلان تمويلي
    if (item.org_name !== undefined) {
      return (
        <View style={styles.cardWrapper}>
          <FavoriteButton id={advertisement_id} />
          <FinancingCard item={item} />
        </View>
      );
    }

    // لو فيه developer_name → إعلان مطور
    if (item.developer_name !== undefined) {
      return (
        <View style={styles.cardWrapper}>
          <FavoriteButton id={advertisement_id} />
          <DevelopmentCard item={item} />
        </View>
      );
    }

    // لو مش معروف → تجاهل
    return null;
  };



  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>إعلاناتك المفضلة</Text>
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>لا يوجد إعلانات مفضلة</Text>
          }
        />
        {/* <FavoriteButton/> */}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 45,
    backgroundColor: '#fff',
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default FavoritesScreen;

// stop_________________________________________