// components/BestDev.js

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from '../FavoriteButton';
import DevelopmentCard from '../DevelopmentCard';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
import { useTheme } from 'react-native-paper';

export default function BestDev() {
  const { colors } = useTheme();
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
        // console.log('Fetched offers:', allAds); // سجل للتحقق
        setOffers(allAds);
      } catch (error) {
        // console.error('Error fetching development ads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
  // console.log(object);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>أفضل عروض التطوير</Text>

      {loading ? (
        <Text style={{ textAlign: 'center', fontSize: 16, color: colors.text }}>
          ...جاري تحميل العروض
        </Text>
      ) : offers.length === 0 ? (
        <Text style={{ textAlign: 'center', fontSize: 16, color: colors.text }}>
          لا توجد عروض حالياً
        </Text>
      ) : (
        <FlatList
          ref={scrollRef}
          horizontal
          data={offers}
          renderItem={renderCard}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
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
    // color: colors.text,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    // color: colors.text,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 3,
  },
  card: {
    width: Dimensions.get('window').width * 0.7,
    marginRight: 16,
    // backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#fff',
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
    // color: colors.text,
  },
  model: {
    fontSize: 13,
    // color: colors.text,
    marginTop: 2,
  },
});


// stop_________________________________________