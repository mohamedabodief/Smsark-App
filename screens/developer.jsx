import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import SearchCard from './components/SearchCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Layout from '../src/Layout';

import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

const DeveloperPage = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanText = (text) => {
    if (!text) return '';
    return text.trim().toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/[ةه]/g, 'ه')
      .replace(/[ؤئ]/g, 'و');
  };

  const filterAds = (allAds) => {
    return allAds.filter((ad) => {
      const text = cleanText(searchText);

      let matchesSearch = true;
      
      if (text !== '') {
        const governorateMatch = ad.location?.governorate && cleanText(ad.location.governorate).includes(text);
        const cityMatch = ad.location?.city && cleanText(ad.location.city).includes(text);
        const nameMatch = ad.developer_name && cleanText(ad.developer_name).includes(text);
        const descriptionMatch = ad.description && cleanText(ad.description).includes(text);
        const projectTypesMatch = ad.project_types && ad.project_types.some(type => cleanText(type).includes(text));
        
        matchesSearch = governorateMatch || cityMatch || nameMatch || descriptionMatch || projectTypesMatch;
      }

      const matchesType = true;

      let adPrice = parseFloat(ad.price_start_from) || 0;
      const from = parseFloat(priceFrom) || 0;
      const to = parseFloat(priceTo) || Infinity;
      const matchesPrice = !priceFrom && !priceTo ? true : adPrice >= from && adPrice <= to;

      const matchesReviewStatus = true;

      const finalResult = matchesSearch && matchesType && matchesPrice && matchesReviewStatus;
      
      return finalResult;
    });
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const allAds = await RealEstateDeveloperAdvertisement.getAll();
      const filteredAds = filterAds(allAds);
      setAds(filteredAds);
      setModalVisible(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('فشل في جلب الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAds();
  }, []);

  const loadAllAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const allAds = await RealEstateDeveloperAdvertisement.getAll();
      setAds(allAds);
    } catch (error) {
      console.error('Error loading ads:', error);
      setError('فشل في جلب الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText || priceFrom || priceTo) {
      applyFilters();
    }
  }, [searchText, priceFrom, priceTo]);

  return (
    <Layout>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
        <ImageBackground source={require('../assets/searchImage.jpg')} style={styles.image}>
          <View style={styles.overlay}>
            <View style={styles.searchRow}>
              <FontAwesome name="search" size={20} color="white" style={styles.searchIcon} />
              <TextInput
                placeholder="ادخل المحافظة أو المدينة أو اسم المطور"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.input}
                placeholderTextColor="white"
                returnKeyType="search"
                onSubmitEditing={applyFilters}
              />
              <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
                <FontAwesome5 name="sliders-h" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <ScrollView contentContainerStyle={{ padding: 10 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={{ textAlign: 'center', color: 'red', marginTop: 20, fontSize: 16 }}>
              {error}
            </Text>
          ) : ads.length === 0 && (searchText || priceFrom || priceTo) ? (
            <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 18 }}>
              لا توجد نتائج تطابق البحث
            </Text>
          ) : ads.length === 0 && !loading ? (
            <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 18 }}>
              لا توجد إعلانات متاحة حالياً
            </Text>
          ) : (
            ads.map((ad, indx) => (
              <SearchCard
                key={indx}
                location={`${ad.location?.governorate || ''} ${ad.location?.city || ''}`.trim() || 'غير محدد'}
                name={ad.developer_name || 'غير محدد'}
                price={`من ${ad.price_start_from || 0} إلى ${ad.price_end_to || 0}`}
                type={ad.project_types?.join(', ') || 'غير محدد'}
                imageUrl={
                  ad.images?.[0] ||
                  'https://upload.wikimedia.org/wikipedia/commons/4/45/WilderBuildingSummerSolstice.jpg'
                }
              />
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>اختر الفلاتر</Text>



            <Text style={styles.label}>نطاق السعر</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
              <TextInput
                placeholder="إلى"
                keyboardType="numeric"
                style={styles.priceInput}
                value={priceTo}
                onChangeText={setPriceTo}
              />
              <TextInput
                placeholder="من"
                keyboardType="numeric"
                style={styles.priceInput}
                value={priceFrom}
                onChangeText={setPriceFrom}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
                <Text style={styles.applyText}>تطبيق</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setPriceFrom('');
                  setPriceTo('');
                  
                }}
                style={[styles.applyButton, { backgroundColor: '#ccc', marginTop: 10 }]}
              >
                <Text style={styles.applyText}>إعادة تعيين</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        </GestureHandlerRootView>
      </Layout>
  );
};

export default DeveloperPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    backgroundColor: '#ffffff44',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'white',
  },
  iconButton: {
    padding: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: 'rgb(121, 119, 234)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 5,
  },
}); 