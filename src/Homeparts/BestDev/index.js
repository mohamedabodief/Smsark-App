// components/BestDev.js
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import DevelopmentCard from '../DevelopmentCard';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

export default function BestDev() {
  const [offers, setOffers] = useState([]);
  const scrollRef = useRef();
  const currentIndex = useRef(0);
  const cardWidth = Dimensions.get('window').width * 0.8;

  useEffect(() => {
    const unsubscribe = RealEstateDeveloperAdvertisement.subscribeActiveAds((ads) => {
      const activeAds = ads.filter(ad => ad.ads === true);
      setOffers(activeAds);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (offers.length === 0) return;

      currentIndex.current = (currentIndex.current + 1) % offers.length;

      scrollRef.current?.scrollToOffset({
        offset: currentIndex.current * cardWidth,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [offers]);

  const renderItem = ({ item }) => <DevelopmentCard item={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أفضل عروض التطوير </Text>
      <FlatList
        data={offers}
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 3,
  },
});
