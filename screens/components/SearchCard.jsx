import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import FinancingRequest from '../../FireBase/modelsWithOperations/FinancingRequest';
import FavoriteButton from '../../src/Homeparts/FavoriteButton';

const SearchCard = ({ name, price, imageUrl, location, type, id, source, onDelete, showDelete = false, showHeart = true, showRequestsButton = false, isDeleting = false, navigation, ...adData }) => {
  const isDeveloper = source === 'developer';
  const isFunder = source === 'financing';
  const isClient = source === 'client';
  const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150?text=Default+Property+Image';
  const [requestCount, setRequestCount] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (isFunder && showRequestsButton) {
      setLoadingRequests(true);
      FinancingRequest.getRequestCountByAdId(id)
        .then(count => {
          setRequestCount(count);
          setLoadingRequests(false);
          console.log(`Request count for ad ${id}: ${count}`);
        })
        .catch(error => {
          console.error(`Error fetching request count for ad ${id}:`, error.message);
          setRequestCount(0);
          setLoadingRequests(false);
        });
    }
  }, [id, isFunder, showRequestsButton]);

  const getDisplayFields = () => {
    if (isDeveloper) {
      return {
        name: adData.developer_name || name || 'بدون عنوان',
        price: adData.price_start_from && adData.price_end_to ? `${adData.price_start_from} - ${adData.price_end_to} جنيه` : price || 'غير محدد',
        location: adData.location || location || 'مقر الشركة',
        type: Array.isArray(adData.project_types) && adData.project_types.length > 0 ? adData.project_types.join(', ') : (typeof adData.project_types === 'string' ? adData.project_types : type || 'عقار مطور'),
      };
    } else if (isFunder) {
      return {
        name: adData.org_name || name || 'بدون عنوان',
        price: adData.start_limit && adData.end_limit ? `${adData.start_limit} - ${adData.end_limit} جنيه` : price || 'غير محدد',
        location: adData.city || location || 'مقر الشركه',
        type: type || 'تمويل',
      };
    } else if (isClient) {
      return {
        name: adData.title || name || 'بدون عنوان',
        price: adData.price ? `${adData.price} جنيه` : price || 'غير محدد',
        location: adData.city || location || 'غير محدد',
        type: adData.type || type || 'غير محدد',
      };
    }
    return {
      name: name || 'بدون عنوان',
      price: price || 'غير محدد',
      location: location || 'غير محدد',
      type: type || 'غير محدد',
    };
  };

  const fields = getDisplayFields();
  const image = Array.isArray(adData.images) && adData.images.length > 0 ? adData.images[0] : (imageUrl || DEFAULT_IMAGE_URL);

  const handlePress = () => {
    if (isDeleting) return;
    if (!navigation) {
      console.error('Navigation prop is undefined in SearchCard');
      Alert.alert('خطأ', 'مشكلة في التنقل. يرجى المحاولة لاحقًا.');
      return;
    }
    console.log('Navigating with source:', source, 'and id:', id);
    let targetScreen;
    if (isDeveloper) {
      targetScreen = 'DevelopmentDetails';
    } else if (isFunder) {
      targetScreen = 'detailsForFinancingAds';
    } else if (isClient) {
      targetScreen = 'ClientDetails';
    } else {
      console.warn('Unknown source type:', source);
      Alert.alert('خطأ', 'نوع الإعلان غير معروف.');
      return;
    }
    try {
      navigation.navigate(targetScreen, { id }); 
      console.log(`Navigated to ${targetScreen} with id: ${id}`);
    } catch (error) {
      console.error('Navigation error:', error.message || error);
      Alert.alert('خطأ', 'فشل في الانتقال إلى صفحة التفاصيل: ' + (error.message || 'يرجى المحاولة لاحقًا'));
    }
  };

  const handleViewRequests = () => {
    if (isFunder) {
      navigation.navigate('MainStack', { screen: 'RequestsForAd', params: { adId: id, adTitle: fields.name } });
      console.log('Navigating to RequestsForAd with params:', { adId: id, adTitle: fields.name });
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} disabled={isDeleting}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
        {showHeart && (
          <TouchableOpacity style={styles.heartIcon}>
            <FontAwesome name="heart-o" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        <FavoriteButton advertisementId={id} />
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          {isFunder && showRequestsButton && (
            <TouchableOpacity
              onPress={handleViewRequests}
              disabled={isDeleting || loadingRequests}
              activeOpacity={0.7}
            >
              <View style={styles.requestCountContainer}>
                <Text style={styles.requestCountText}>
                  {loadingRequests ? 'جاري التحميل...' : `${requestCount !== null ? requestCount : 0} طلبات`}
                </Text>
                <MaterialIcons name="request-quote" size={14} color="#666" />
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{fields.type}</Text>
          </View>
        </View>
        <Text style={styles.name}>{fields.name}</Text>
        {fields.location && (
          <Text style={styles.location}>
            <MaterialIcons name="location-pin" size={14} color="#999" />
            {typeof fields.location === 'string' ? fields.location : `${fields.location?.governorate || ''} - ${fields.location?.city || ''}`}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>{fields.price} <Text style={styles.perNight}></Text></Text>
          <View style={styles.buttonsContainer}>
            {showDelete && (
              <TouchableOpacity
                style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
                onPress={() => onDelete(id, source)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteButtonText}>حذف</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 5,
    marginHorizontal: 5,
    elevation: 3,
    direction: 'rtl',
  },
  imageWrapper: {
    width: 120,
    height: 148,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 10,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  requestCountContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  requestCountText: {
    fontSize: 13,
    color: '#666',
    textDecorationLine: 'underline',
  },
  typeContainer: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  type: {
    fontSize: 12,
    color: '#007BFF',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 14,
    color: '#ff5733',
    fontWeight: 'bold',
  },
  perNight: {
    color: '#888',
    fontSize: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  deleteButton: {
    backgroundColor: '#4D00B1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#9966a0ff',
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SearchCard;