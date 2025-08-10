import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import ClientAdvertisement from '../../../FireBase/modelsWithOperations/ClientAdvertisement';
import { useRoute } from '@react-navigation/native';
import StatusBarComponent from '../../../screens/components/StatusBarComponent';

const DetailsForClient = () => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const route = useRoute();
  const { id: adId } = route.params || {};

  useEffect(() => {
    const fetchAd = async () => {
      if (!adId) {
        setError('معرف الإعلان غير صالح');
        setLoading(false);
        return;
      }

      try {
        const result = await ClientAdvertisement.getById(adId);
        if (!result) {
          setError('لم يتم العثور على الإعلان');
          setLoading(false);
          return;
        }
        setAd(result);
      } catch (error) {
        setError('فشل في جلب تفاصيل الإعلان: ' + (error.message || 'خطأ غير معروف'));
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId]);

  const openWhatsApp = () => {
    if (!ad?.phone) {
      return;
    }
    const message = `مرحبًا، أنا مهتم بإعلان: ${ad.title || 'إعلان عقاري'}`;
    const url = `whatsapp://send?phone=${ad.phone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch((err) => {
      setError('فشل في فتح واتساب، تأكد من وجود التطبيق');
    });
  };

  const makeCall = () => {
    if (!ad?.phone) {
      return;
    }
    const url = `tel:${ad.phone}`;
    Linking.openURL(url).catch((err) => {
      setError('فشل في إجراء المكالمة');
    });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4D00B1" />
        <Text style={styles.loadingText}>جارٍ تحميل التفاصيل...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <MaterialIcons name="error-outline" size={40} color="#FF4D4D" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ad) {
    return (
      <View style={styles.centeredContainer}>
        <MaterialIcons name="error-outline" size={40} color="#FF4D4D" />
        <Text style={styles.errorText}>الإعلان غير موجود</Text>
      </View>
    );
  }

  return (
    <StatusBarComponent backgroundColor="#ffffff" barStyle="dark-content">
    <ScrollView style={styles.container}>
      {ad.images?.length > 0 ? (
        <Image
          source={{ uri: ad.images[0] }}
          style={styles.mainImage}
          onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <MaterialIcons name="image-not-supported" size={50} color="#999" />
          <Text style={styles.placeholderText}>لا توجد صورة متاحة</Text>
        </View>
      )}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <MaterialIcons name="title" size={20} color="#4D00B1" />
          <Text style={styles.title}>{ad.title || 'بدون عنوان'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="attach-money" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>
            السعر: {ad.price ? `${ad.price.toLocaleString()} جنيه` : 'غير محدد'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="description" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>{ad.description || 'بدون وصف'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>
            الموقع: {(ad.city || ad.governorate) ? `${ad.city || ''} - ${ad.governorate || ''}`.trim() : 'غير محدد'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="square-foot" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>
            المساحة: {ad.space ? `${ad.space} م²` : 'غير محدد'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="category" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>نوع العقار: {ad.type || 'غير محدد'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="sell" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>نوع الإعلان: {ad.ad_type || 'غير محدد'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="info" size={20} color="#4D00B1" />
          <Text style={styles.infoText}>الحالة: {ad.status || 'غير محدد'}</Text>
        </View>
        {ad.phone ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.whatsappButton]}
              onPress={openWhatsApp}
              disabled={!ad.phone}
            >
              <FontAwesome5 name="whatsapp" size={20} color="#fff" />
              <Text style={styles.buttonText}>واتساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.callButton]}
              onPress={makeCall}
              disabled={!ad.phone}
            >
              <MaterialIcons name="phone" size={20} color="#fff" />
              <Text style={styles.buttonText}>اتصال</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noPhoneText}>رقم الهاتف غير متاح</Text>
        )}
      </View>
    </ScrollView>
    </StatusBarComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    direction:'rtl'
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    marginTop:19,
    backgroundColor: '#E7E7E7',
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  callButton: {
    backgroundColor: '#4D00B1',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noPhoneText: {
    fontSize: 16,
    color: '#FF4D4D',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FF4D4D',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4D00B1',
    marginTop: 8,
  },
});

export default DetailsForClient;