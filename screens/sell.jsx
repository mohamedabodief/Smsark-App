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
import DropDownPicker from 'react-native-dropdown-picker';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisement';
import Layout from '../src/Layout';

const SellPage = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [propertyTypeValue, setPropertyTypeValue] = useState(null);
  const [propertyTypeItems, setPropertyTypeItems] = useState([
    { label: 'شقة', value: 'شقة' },
    { label: 'فيلا', value: 'فيلا' },
    { label: 'محل تجارى', value: 'محل' },
  ]);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(null);
  const [statusItems, setStatusItems] = useState([
    { label: 'بيع', value: 'بيع' },
    { label: 'إيجار', value: 'إيجار' },
  ]);

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
        const governorateMatch = ad.governorate && cleanText(ad.governorate).includes(text);
        const cityMatch = ad.city && cleanText(ad.city).includes(text);
        const titleMatch = ad.title && cleanText(ad.title).includes(text);
        const descriptionMatch = ad.description && cleanText(ad.description).includes(text);
        const typeMatch = ad.type && cleanText(ad.type).includes(text);
        const adTypeMatch = ad.ad_type && cleanText(ad.ad_type).includes(text);
        
        matchesSearch = governorateMatch || cityMatch || titleMatch || descriptionMatch || typeMatch || adTypeMatch;
      }

      let matchesStatus = !statusValue;
      
      if (statusValue) {
        if (statusValue === 'بيع') {
          const adTypeClean = cleanText(ad.ad_type);
          matchesStatus = adTypeClean === 'بيع' || adTypeClean === 'sale' || adTypeClean === 'buy' || adTypeClean === 'مبيع';
        } else if (statusValue === 'إيجار') {
          const adTypeClean = cleanText(ad.ad_type);
          matchesStatus = adTypeClean === 'إيجار' || adTypeClean === 'ايجار' || adTypeClean === 'rent' || adTypeClean === 'rental' || adTypeClean === 'تأجير' || adTypeClean === 'تاجير';
        }
      }

      const matchesType =
        !propertyTypeValue ||
        (cleanText(ad.type) === cleanText(propertyTypeValue) ||
         cleanText(ad.type)?.includes(cleanText(propertyTypeValue)) ||
         cleanText(propertyTypeValue)?.includes(cleanText(ad.type)));

      let adPrice = parseFloat(ad.price) || 0;
      const from = parseFloat(priceFrom) || 0;
      const to = parseFloat(priceTo) || Infinity;
      const matchesPrice = !priceFrom && !priceTo ? true : adPrice >= from && adPrice <= to;

      const matchesReviewStatus = true;

      const finalResult = matchesSearch && matchesStatus && matchesType && matchesPrice && matchesReviewStatus;
      
      return finalResult;
    });
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const allAds = await ClientAdvertisement.getAll();
      const filteredAds = filterAds(allAds);
      setAds(filteredAds);
      setModalVisible(false);
    } catch (error) {
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
      const allAds = await ClientAdvertisement.getAll();
      setAds(allAds);
    } catch (error) {
      setError('فشل في جلب الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText || statusValue || propertyTypeValue || priceFrom || priceTo) {
      applyFilters();
    }
  }, [searchText, statusValue, propertyTypeValue, priceFrom, priceTo]);

  return (
    <Layout>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
        <ImageBackground source={require('../assets/searchImage.jpg')} style={styles.image}>
          <View style={styles.overlay}>
            <View style={styles.searchRow}>
              <FontAwesome name="search" size={20} color="white" style={styles.searchIcon} />
              <TextInput
                placeholder="ادخل المحافظة أو المدينة (مثل القاهرة)"
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
          ) : ads.length === 0 && (searchText || statusValue || propertyTypeValue || priceFrom || priceTo) ? (
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
              navigation={navigation}
              source={'client'}
               showHeart={false}
                key={indx}
                id={ad.id}
                location={`${ad.governorate || ''} ${ad.city || ''}`.trim() || 'غير محدد'}
                name={ad.title || 'غير محدد'}
                price={ad.price || 'غير محدد'}
                type={ad.ad_type || ad.type || 'غير محدد'}
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

            <DropDownPicker
              open={statusOpen}
              value={statusValue}
              items={statusItems}
              setOpen={setStatusOpen}
              setValue={setStatusValue}
              setItems={setStatusItems}
              placeholder="حالة العقار"
              zIndex={2000}
              style={{
                marginTop: 20,
                borderColor: '#ccc',
                borderRadius: 10,
                height: 50,
              }}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.text}
              placeholderStyle={styles.placeholder}
              tickIconStyle={{ tintColor: 'purple' }}
              selectedItemContainerStyle={{ backgroundColor: '#E7E7E7' }}
            />

            <DropDownPicker
              open={propertyTypeOpen}
              value={propertyTypeValue}
              items={propertyTypeItems}
              setOpen={setPropertyTypeOpen}
              setValue={setPropertyTypeValue}
              setItems={setPropertyTypeItems}
              placeholder="نوع العقار"
              style={{
                marginTop: 20,
                borderColor: '#ccc',
                borderRadius: 10,
                height: 50,
              }}
              zIndex={1000}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.text}
              placeholderStyle={styles.placeholder}
              tickIconStyle={{ tintColor: 'purple' }}
              selectedItemContainerStyle={{ backgroundColor: '#E7E7E7' }}
            />

            <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
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
                  setStatusValue(null);
                  setPropertyTypeValue(null);
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

export default SellPage;

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
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 10,
    direction: 'rtl',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc',
  },
});
