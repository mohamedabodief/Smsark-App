import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import ClientAdvertisement from '../../../FireBase/modelsWithOperations/ClientAdvertisement';
import { useRoute } from '@react-navigation/native';

const DetailsForClient = () => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { adId } = route.params; 

  useEffect(() => {
    const fetchAd = async () => {
      const result = await ClientAdvertisement.getById(adId);
      setAd(result);
      setLoading(false);
    };

    fetchAd();
  }, [adId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  if (!ad) {
    return <Text style={styles.errorText}>الإعلان غير موجود</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {ad.images?.length > 0 && (
        <Image source={{ uri: ad.images[0] }} style={styles.mainImage} />
      )}
      <Text style={styles.title}>{ad.title}</Text>
      <Text style={styles.price}>السعر: {ad.price} جنيه</Text>
      <Text style={styles.description}>{ad.description}</Text>
      <Text>الموقع: {ad.city} - {ad.governorate}</Text>
      <Text>المساحة: {ad.space} م²</Text>
      <Text>نوع العقار: {ad.type}</Text>
      <Text>نوع الإعلان: {ad.ad_type}</Text>
      <Text>الحالة: {ad.status}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  mainImage: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 18, color: 'green', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: 'red' },
});

export default DetailsForClient;
