
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
import FinancingAdvertisement from '../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

const SearchPage = () => {
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
    { label: 'ممول عقارى', value: 'ممول عقارى' },
    { label: 'مطور عقارى', value: 'مطور عقارى' },
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

        if (ad instanceof ClientAdvertisement) {
          const governorateMatch = ad.governorate && cleanText(ad.governorate).includes(text);
          const cityMatch = ad.city && cleanText(ad.city).includes(text);
          const titleMatch = ad.title && cleanText(ad.title).includes(text);
          const descriptionMatch = ad.description && cleanText(ad.description).includes(text);
          const typeMatch = ad.type && cleanText(ad.type).includes(text);
          const adTypeMatch = ad.ad_type && cleanText(ad.ad_type).includes(text);
          
          matchesSearch = governorateMatch || cityMatch || titleMatch || descriptionMatch || typeMatch || adTypeMatch;
        }

        else if (ad instanceof RealEstateDeveloperAdvertisement) {
          const governorateMatch = ad.location?.governorate && cleanText(ad.location.governorate).includes(text);
          const cityMatch = ad.location?.city && cleanText(ad.location.city).includes(text);
          const nameMatch = ad.developer_name && cleanText(ad.developer_name).includes(text);
          const descriptionMatch = ad.description && cleanText(ad.description).includes(text);
          const projectTypesMatch = ad.project_types && ad.project_types.some(type => cleanText(type).includes(text));
          
          matchesSearch = governorateMatch || cityMatch || nameMatch || descriptionMatch || projectTypesMatch;
          
        }

        else if (ad instanceof FinancingAdvertisement) {
          const titleMatch = ad.title && cleanText(ad.title).includes(text);
          const descriptionMatch = ad.description && cleanText(ad.description).includes(text);
          const orgNameMatch = ad.org_name && cleanText(ad.org_name).includes(text);
          const typeOfUserMatch = ad.type_of_user && cleanText(ad.type_of_user).includes(text);
          
          matchesSearch = titleMatch || descriptionMatch || orgNameMatch || typeOfUserMatch;
        }
      }


      let matchesStatus = !statusValue;
      
      if (statusValue) {
        if (statusValue === 'بيع' && ad instanceof ClientAdvertisement) {
          const adTypeClean = cleanText(ad.ad_type);
          matchesStatus = adTypeClean === 'بيع' || adTypeClean === 'sale' || adTypeClean === 'buy' || adTypeClean === 'مبيع' || adTypeClean === 'مبيع';
        
        } else if (statusValue === 'إيجار' && ad instanceof ClientAdvertisement) {
          const adTypeClean = cleanText(ad.ad_type);
          matchesStatus = adTypeClean === 'إيجار' || adTypeClean === 'ايجار' || adTypeClean === 'rent' || adTypeClean === 'rental' || adTypeClean === 'تأجير' || adTypeClean === 'تاجير';
        
        } else if (statusValue === 'ممول عقارى' && ad instanceof FinancingAdvertisement) {
          matchesStatus = true;
        } else if (statusValue === 'مطور عقارى' && ad instanceof RealEstateDeveloperAdvertisement) {
          matchesStatus = true;
        }
      }


      const matchesType =
        !propertyTypeValue ||
        (ad instanceof ClientAdvertisement && (
          cleanText(ad.type) === cleanText(propertyTypeValue) ||
          cleanText(ad.type)?.includes(cleanText(propertyTypeValue)) ||
          cleanText(propertyTypeValue)?.includes(cleanText(ad.type))
        )) ||
        !(ad instanceof ClientAdvertisement);


      let adPrice = 0;
      if (ad instanceof ClientAdvertisement) {
        adPrice = parseFloat(ad.price) || 0;
      }
      const from = parseFloat(priceFrom) || 0;
      const to = parseFloat(priceTo) || Infinity;
      const matchesPrice =
        !priceFrom && !priceTo ? true : ad instanceof ClientAdvertisement && adPrice >= from && adPrice <= to;

      const matchesReviewStatus = true;


      let locationInfo = {};
      if (ad instanceof ClientAdvertisement) {
        locationInfo = { governorate: ad.governorate, city: ad.city };
      } else if (ad instanceof RealEstateDeveloperAdvertisement) {
        locationInfo = { governorate: ad.location?.governorate, city: ad.location?.city };
      } else if (ad instanceof FinancingAdvertisement) {
        locationInfo = { governorate: 'غير متوفر', city: 'غير متوفر' };
      }

  

      const finalResult = matchesSearch && matchesStatus && matchesType && matchesPrice && matchesReviewStatus;
      
      if (!finalResult) {
      }
      
      return finalResult;
    });
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      let allAds = [];
      if (statusValue === 'ممول عقارى') {
        allAds = await FinancingAdvertisement.getAll();
       
      } else if (statusValue === 'مطور عقارى') {
        allAds = await RealEstateDeveloperAdvertisement.getAll();
      
      } else {

        const [clientAds, developerAds, financingAds] = await Promise.all([
          ClientAdvertisement.getAll(),
          RealEstateDeveloperAdvertisement.getAll(),
          FinancingAdvertisement.getAll()
        ]);
        allAds = [...clientAds, ...developerAds, ...financingAds];
      
      }

      const filteredAds = filterAds(allAds);
   
      
      const approvedAds = allAds;
    
      
      const adsWithLocation = allAds.filter(ad => {
        if (ad instanceof ClientAdvertisement) {
          return ad.governorate || ad.city;
        } else if (ad instanceof RealEstateDeveloperAdvertisement) {
          return ad.location?.governorate || ad.location?.city;
        }
        return false;
      });
     
      
      const clientAds = allAds.filter(ad => ad instanceof ClientAdvertisement);
      const rentAds = clientAds.filter(ad => {
        const adTypeClean = cleanText(ad.ad_type);
        return adTypeClean === 'إيجار' || adTypeClean === 'rent' || adTypeClean === 'rental';
      });
      const saleAds = clientAds.filter(ad => {
        const adTypeClean = cleanText(ad.ad_type);
        return adTypeClean === 'بيع' || adTypeClean === 'sale' || adTypeClean === 'buy';
      });
 
      const approvedRentAds = rentAds;
      const approvedSaleAds = saleAds;

      

      const approvedAdsWithLocation = approvedAds.filter(ad => {
        if (ad instanceof ClientAdvertisement) {
          return ad.governorate || ad.city;
        } else if (ad instanceof RealEstateDeveloperAdvertisement) {
          return ad.location?.governorate || ad.location?.city;
        }
        return false;
      });
      
      

      const approvedRentAdsWithLocation = approvedRentAds.filter(ad => ad.governorate || ad.city);
     
      
      const approvedSaleAdsWithLocation = approvedSaleAds.filter(ad => ad.governorate || ad.city);
     
      
      const developerAds = allAds.filter(ad => ad instanceof RealEstateDeveloperAdvertisement);
              const approvedDeveloperAds = developerAds;
      const approvedDeveloperAdsWithLocation = approvedDeveloperAds.filter(ad => ad.location?.governorate || ad.location?.city);
      
      const financingAds = allAds.filter(ad => ad instanceof FinancingAdvertisement);
              const approvedFinancingAds = financingAds;
     
      
      const approvedFinancingAdsWithLocation = approvedFinancingAds.filter(ad => ad.location?.governorate || ad.location?.city);
     
      
      if (approvedAdsWithLocation.length > 0) {
       
        approvedAdsWithLocation.slice(0, 3).forEach((ad, index) => {
        
        });
      }
      

      
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
    applyFilters();
  }, [searchText, statusValue, propertyTypeValue, priceFrom, priceTo]);

  return (
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
          ) : !searchText && !statusValue && !propertyTypeValue && !priceFrom && !priceTo ? (
            <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 18 }}>
              🏘️ اكتشف العقارات المناسبة لك عن طريق البحث أو استخدام الفلاتر
            </Text>
          ) : ads.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 18 }}>
              لا توجد نتائج تطابق البحث
            </Text>
          ) : (
            ads.map((ad,indx) => (
              <SearchCard
                key={indx}
                   location={
                  ad instanceof ClientAdvertisement 
                    ? `${ad.governorate || ''} ${ad.city || ''}`.trim() || 'غير محدد'
                    : ad instanceof RealEstateDeveloperAdvertisement
                    ? `${ad.location?.governorate || ''} ${ad.location?.city || ''}`.trim() || 'غير محدد'
                    : ad instanceof FinancingAdvertisement
                    ? null
                    : 'غير محدد'
                }
                name={ad.title || ad.org_name || ad.developer_name || 'غير محدد'}
                price={
                  ad instanceof ClientAdvertisement
                    ? ad.price || 'غير محدد'
                    : ad instanceof FinancingAdvertisement
                    ? `من ${ad.start_limit} إلى ${ad.end_limit}`
                    : `من ${ad.price_start_from} إلى ${ad.price_end_to}`
                }
                type={ad.status || ad.type_of_user || ad.project_types?.join(', ') || ad.type || 'غير محدد'}
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
  );
};

export default SearchPage;

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
