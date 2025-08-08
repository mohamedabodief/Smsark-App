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
import FinancingAdvertisement from '../../../FireBase/modelsWithOperations/FinancingAdvertisement';
import { auth } from '../../../FireBase/firebaseConfig';
import User from '../../../FireBase/modelsWithOperations/User';

const PACKAGE_INFO = {
  1: { name: 'باقة الأساس', price: 100, duration: 7 },
  2: { name: 'باقة النخبة', price: 150, duration: 14 },
  3: { name: 'باقة التميز', price: 200, duration: 21 },
};

export default function DetailsForFinancingAds() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [clientAds, setClientAds] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);
  const [userType, setUserType] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const userData = await User.getByUid(auth.currentUser.uid);
          if (userData && userData.type_of_user) {
            setUserType(userData.type_of_user);
          } else {
            setUserType(null);
          }
        } catch (error) {
          setUserType(null);
        }
      } else {
        setUserType(null);
      }

      // استرجاع تفاصيل الإعلان
      if (!id || typeof id !== 'string') {
        Alert.alert("خطأ", "معرّف الإعلان غير صالح");
        navigation.navigate('Home');
        return;
      }

      try {
        const adDetails = await FinancingAdvertisement.getById(id);
        if (!adDetails) {
          Alert.alert("خطأ", "الإعلان غير موجود");
          navigation.navigate('Home');
          return;
        }

        setClientAds(adDetails);
        if (Array.isArray(adDetails.images) && adDetails.images.length > 0) {
          setMainImage(adDetails.images[0]);
        }
      } catch (error) {
        Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات");
        navigation.navigate('Home');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const submitRequest = () => {
    if (!auth.currentUser) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول لتقديم طلب.');
      navigation.navigate('Login');
      return;
    }
    const userId = auth.currentUser.uid;
    navigation.navigate('FinancingRequest', {
      advertisementId: id,
      userId,
      advertisementTitle: clientAds.title,
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!clientAds) return null;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: mainImage }}
        style={styles.mainImage}
        resizeMode="cover"
      />
      <ScrollView horizontal style={styles.previewRow}>
        {clientAds.images.map((img, idx) => (
          <TouchableOpacity key={idx} onPress={() => setMainImage(img)}>
            <Image source={{ uri: img }} style={styles.previewImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{clientAds.title}</Text>
          {userType === 'client' && (
            <TouchableOpacity onPress={submitRequest} style={styles.submitRequestBtn}>
              <Text style={styles.btnText}>قدم طلب الآن</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text numberOfLines={showFull ? undefined : 4} style={styles.description}>
          {clientAds.description || 'لا يوجد وصف'}
        </Text>
        {clientAds.description?.length > 200 && (
          <TouchableOpacity onPress={() => setShowFull(!showFull)}>
            <Text style={styles.moreBtn}>{showFull ? 'إخفاء التفاصيل' : 'عرض المزيد'}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>الجهة:</Text>
          <Text style={styles.value}>{clientAds.org_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>رقم الهاتف:</Text>
          <Text style={styles.value}>{clientAds.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>السعر من:</Text>
          <Text style={styles.value}>{clientAds.start_limit} ج.م</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>السعر إلى:</Text>
          <Text style={styles.value}>{clientAds.end_limit} ج.م</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>نسب الفائدة:</Text>
          <Text style={styles.value}>
            حتى 5 سنوات: {clientAds.interest_rate_upto_5}% | حتى 10 سنوات: {clientAds.interest_rate_upto_10}% | أكثر من 10 سنوات: {clientAds.interest_rate_above_10}%
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>الباقة:</Text>
          <Text style={styles.value}>
            {clientAds.adPackageName || PACKAGE_INFO[String(clientAds.adPackage)]?.name}
          </Text>
        </View>
      </View>

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6E00FE', flex: 1 },
  description: { fontSize: 16, lineHeight: 22, color: '#333' },
  moreBtn: { color: '#6E00FE', marginTop: 6, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginVertical: 4 },
  label: { fontWeight: 'bold', marginRight: 8 },
  value: { color: '#333' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  callBtn: {
    backgroundColor: '#DF3631',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 5,
    marginBottom: 10,
  },
  whatsappBtn: {
    backgroundColor: '#4DBD43',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 5,
    marginBottom: 10,
  },
  submitRequestBtn: {
    backgroundColor: '#6E00FE',
    padding: 12,
    borderRadius: 25,
    flex: 0.4,
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});