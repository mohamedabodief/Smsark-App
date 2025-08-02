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
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';

const FinancingPage = ({ navigation }) => { // إضافة navigation كخاصية
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
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
        const titleMatch = ad.title && cleanText(ad.title).includes(text);
        const descriptionMatch = ad.description && cleanText(ad.description).includes(text);
        const orgNameMatch = ad.org_name && cleanText(ad.org_name).includes(text);
        const typeOfUserMatch = ad.type_of_user && cleanText(ad.type_of_user).includes(text);
        matchesSearch = titleMatch || descriptionMatch || orgNameMatch || typeOfUserMatch;
      }

      const matchesUserType = true;
      let adAmount = parseFloat(ad.start_limit) || 0;
      const from = parseFloat(amountFrom) || 0;
      const to = parseFloat(amountTo) || Infinity;
      const matchesAmount = !amountFrom && !amountTo ? true : adAmount >= from && adAmount <= to;
      const matchesReviewStatus = true;

      return matchesSearch && matchesUserType && matchesAmount && matchesReviewStatus;
    });
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const allAds = await FinancingAdvertisement.getAll();
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
      const allAds = await FinancingAdvertisement.getAll();
      setAds(allAds);
    } catch (error) {
      console.error('Error loading ads:', error);
      setError('فشل في جلب الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText || amountFrom || amountTo) {
      applyFilters();
    }
  }, [searchText, amountFrom, amountTo]);

  return (
    <Layout>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground source={require('../assets/searchImage.jpg')} style={styles.image}>
            <View style={styles.overlay}>
              <View style={styles.searchRow}>
                <FontAwesome name="search" size={20} color="white" style={styles.searchIcon} />
                <TextInput
                  placeholder="ادخل اسم المؤسسة أو نوع التمويل"
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
            ) : ads.length === 0 && (searchText || amountFrom || amountTo) ? (
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
                  showHeart={false}
                  key={indx}
                  id={ad.id}
                  location={null}
                  name={ad.org_name || ad.title || 'غير محدد'}
                  price={`من ${ad.start_limit || 0} إلى ${ad.end_limit || 0}`}
                  type={ad.type_of_user || ad.title || 'غير محدد'}
                  imageUrl={
                    ad.images?.[0] ||
                    'https://upload.wikimedia.org/wikipedia/commons/4/45/WilderBuildingSummerSolstice.jpg'
                  }
                  source="financing"
                  navigation={navigation} 
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
              <Text style={styles.label}>نطاق المبلغ</Text>
              <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                <TextInput
                  placeholder="إلى"
                  keyboardType="numeric"
                  style={styles.priceInput}
                  value={amountTo}
                  onChangeText={setAmountTo}
                />
                <TextInput
                  placeholder="من"
                  keyboardType="numeric"
                  style={styles.priceInput}
                  value={amountFrom}
                  onChangeText={setAmountFrom}
                />
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
                  <Text style={styles.applyText}>تطبيق</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setAmountFrom('');
                    setAmountTo('');
                    setModalVisible(false); 
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

export default FinancingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 150,
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