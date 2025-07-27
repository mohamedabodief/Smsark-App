// components/BestDev.js

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from '../FavoriteButton';
import DevelopmentCard from '../DevelopmentCard';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
// بيانات ثابتة بدل Firebase
// const mockOffers = [
//   {
//     id: '1',
//     title: 'كمبوند النرجس',
//     developer_name: 'الشركة المصرية للتطوير',
//     location: 'القاهرة الجديدة',
//     description: 'مشروع سكني متكامل',
//     image: 'https://i.pinimg.com/736x/c7/bb/cb/c7bbcb554ce248b2c7576884d4577e24.jpg',
//     price_start_from: 1500000,
//     price_end_to: 3000000,
//   },
//   {
//     id: '2',
//     title: 'كمبوند اللوتس',
//     developer_name: 'شركة المستقبل',
//     location: '6 أكتوبر',
//     description: 'وحدات فاخرة بأسعار مميزة',
//     image: 'https://blog.karmod.ae/wp-content/uploads/prefabrik-ev-3.jpg',
//     price_start_from: 1200000,
//     price_end_to: 2500000,
//   },
//   {
//     id: '3',
//     title: 'كمبوند اللوتس',
//     developer_name: 'شركة المستقبل',
//     location: '6 أكتوبر',
//     description: 'وحدات فاخرة بأسعار مميزة',
//     image: 'https://sakan.co/blog/wp-content/uploads/2023/12/%D8%A7%D8%B3%D8%AA%D8%AB%D9%85%D8%A7%D8%B1-%D8%A2%D9%85%D9%86-%D9%88%D9%85%D8%B1%D9%8A%D8%AD-%D8%AF%D9%84%D9%8A%D9%84%D9%83-%D9%84%D8%B4%D8%B1%D8%A7%D8%A1-%D8%A8%D9%8A%D8%AA-%D9%84%D9%84%D8%A8%D9%8A%D8%B9-%D9%81%D9%8A-%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA.jpg',
//     price_start_from: 1200000,
//     price_end_to: 2500000,
//   },
//   // أضف المزيد حسب الحاجة
// ];

export default function BestDev() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const cardWidth = Dimensions.get('window').width * 0.8;
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allAds = await RealEstateDeveloperAdvertisement.getAll();
        const approvedAds = allAds.filter((ad) => ad.status === 'approved');
        setOffers(approvedAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => clearInterval(intervalRef.current);
  }, []);


  useEffect(() => {
    if (offers.length === 0) return;

    intervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        currentIndex.current = (currentIndex.current + 1) % offers.length;
        scrollRef.current.scrollToOffset({
          offset: currentIndex.current * cardWidth,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [offers]);

  const renderCard = ({ item }) => <DevelopmentCard item={item} />;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>أفضل عروض التطوير</Text>

      {loading ? (
        <Text style={styles.loading}>...جاري تحميل العروض</Text>
      ) : offers.length === 0 ? (
        <Text style={styles.loading}>لا توجد عروض حالياً</Text>
      ) : (
        <FlatList
          ref={scrollRef}
          horizontal
          data={offers}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          getItemLayout={(data, index) => ({
            length: cardWidth,
            offset: cardWidth * index,
            index,
          })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 3,
  },
  card: {
    width: Dimensions.get('window').width * 0.7,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  price: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    fontSize: 15,
    marginTop: 4,
  },
  model: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
