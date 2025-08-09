import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomepageAdvertisement from '../../../FireBase/modelsWithOperations/HomepageAdvertisement';

const SimpleHeroSlider = () => {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = HomepageAdvertisement.subscribeActiveAds((adsData) => {
      setAds(adsData); // تم حذف فلترة approved
      setIndex(0);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <View style={styles.container}>
      {ads.length > 0 && (
        <Image
          source={ads[index].image ? { uri: ads[index].image } : require('../../assets/background.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity style={styles.leftArrow} onPress={prevSlide}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rightArrow} onPress={nextSlide}>
        <Ionicons name="chevron-forward" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  image: {
    width: width,
    height: '120%',
  },
  leftArrow: {
    position: 'absolute',
    top: '50%',
    left: 16,
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  rightArrow: {
    position: 'absolute',
    top: '50%',
    right: 16,
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
});

export default SimpleHeroSlider;
