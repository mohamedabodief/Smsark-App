import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

const PACKAGE_INFO = {
  1: { name: 'باقة الأساس', price: 100, duration: 7 },
  2: { name: 'باقة النخبة', price: 150, duration: 14 },
  3: { name: 'باقة التميز', price: 200, duration: 21 },
};

export default function DetailsForDevelopment() {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (item) {
      setClientAds(item);
      if (Array.isArray(item.images) && item.images.length > 0) {
        setMainImage(item.images[0]);
      }
      setLoading(false);
    } else {
      Alert.alert("خطأ", "الإعلان غير موجود");
      navigation.goBack();
    }
  }, []);

  const handleShare = () => {
    Alert.alert("مشاركة", "هذه الخاصية غير مدعومة بالكامل على هذا الجهاز");
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${clientAds.phone}?text=${encodeURIComponent('مرحبًا، أريد الاستفسار عن الإعلان الخاص بك')}`;
    Linking.openURL(url);
  };

  const callNow = () => {
    Linking.openURL(`tel:${clientAds.phone}`);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!clientAds) return null;

  return (
    <ScrollView style={styles.container}>
      {/* الصور الرئيسية والمعاينة */}
      <Image
        source={mainImage ? { uri: mainImage } : require('../../assets/1.webp')}
        style={styles.mainImage}
        resizeMode="cover"
      />
      <ScrollView horizontal style={styles.previewRow}>
        {clientAds.images && clientAds.images.length > 0 ? (
          clientAds.images.map((img, idx) => (
            <TouchableOpacity key={idx} onPress={() => setMainImage(img)}>
              <Image source={{ uri: img }} style={styles.previewImage} />
            </TouchableOpacity>
          ))
        ) : (
          <Image source={require('../../assets/1.webp')} style={styles.previewImage} />
        )}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{clientAds.developer_name || 'غير معروف'}</Text>
        <Text numberOfLines={showFull ? undefined : 4} style={styles.description}>
          {clientAds.description || 'لا يوجد وصف'}
        </Text>
        {clientAds.description?.length > 200 && (
          <TouchableOpacity onPress={() => setShowFull(!showFull)}>
            <Text style={styles.moreBtn}>{showFull ? 'إخفاء التفاصيل' : 'عرض المزيد'}</Text>
          </TouchableOpacity>
        )}

        {/* معلومات المطور */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>المطور:</Text>
          <Text style={styles.value}>{clientAds.developer_name || 'غير معروف'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>رقم الهاتف:</Text>
          <Text style={styles.value}>{clientAds.phone || 'غير متوفر'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>السعر من:</Text>
          <Text style={styles.value}>
            {clientAds.price_start_from ? clientAds.price_start_from.toLocaleString() : '—'} ج.م
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>السعر إلى:</Text>
          <Text style={styles.value}>
            {clientAds.price_end_to ? clientAds.price_end_to.toLocaleString() : '—'} ج.م
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>الموقع:</Text>
          <Text style={styles.value}>{clientAds.location || 'غير محدد'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>المساحة:</Text>
          <Text style={styles.value}>{clientAds.area ? `${clientAds.area} متر` : 'غير محدد'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>شروط التسليم:</Text>
          <Text style={styles.value}>{clientAds.deliveryTerms || 'غير محدد'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>الباقة:</Text>
          <Text style={styles.value}>
            {clientAds.adPackageName || PACKAGE_INFO[String(clientAds.adPackage)]?.name || 'غير محدد'}
          </Text>
        </View>
      </View>

      {/* أزرار التواصل */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={callNow} style={styles.callBtn}>
          <Text style={styles.btnText}>اتصل الآن</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openWhatsApp} style={styles.whatsappBtn}>
          <Text style={styles.btnText}>واتساب</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  mainImage: { width: '100%', height: 250, borderRadius: 12 },
  previewRow: { flexDirection: 'row', marginVertical: 10 },
  previewImage: { width: 80, height: 80, marginRight: 8, borderRadius: 8 },
  detailsContainer: { padding: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6E00FE', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 22, color: '#333' },
  moreBtn: { color: '#6E00FE', marginTop: 6, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginVertical: 4 },
  label: { fontWeight: 'bold', marginRight: 8 },
  value: { color: '#333' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  callBtn: {
    backgroundColor: '#DF3631',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  whatsappBtn: {
    backgroundColor: '#4DBD43',
    padding: 12,
    borderRadius: 25,
    flex: 1,
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});


// stop_________________________________________