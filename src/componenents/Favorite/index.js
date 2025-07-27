// src/screens/FavoritesScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadFavoritesAsync } from '../../redux/favoritesSlice';
import FinancingCard from '../../Homeparts/FinancingCard';
import DevelopmentCard from '../../Homeparts/DevelopmentCard';
import Layout from '../../Layout';
import { useFocusEffect } from '@react-navigation/native';


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
  if (item.type === 'financing') {
    return <FinancingCard item={{ ...item, type: 'financing' }} />;
  } else if (item.type === 'development') {
    return <DevelopmentCard item={{ ...item, type: 'development' }} />;
  }
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
    </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
