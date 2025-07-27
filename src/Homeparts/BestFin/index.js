import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FavoriteButton from '../FavoriteButton';
import FinancingCard from '../FinancingCard';
import FinancingAdvertisement from '../../../FireBase/modelsWithOperations/FinancingAdvertisement';

export default function BestFin() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const cardWidth = Dimensions.get('window').width * 0.8;
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = FinancingAdvertisement.subscribeActiveAds((ads) => {
      setOffers(ads);
      setLoading(false);
    });

    return () => unsubscribe();
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

  const renderCard = ({ item }) => <FinancingCard item={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أفضل عروض التمويل</Text>

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
