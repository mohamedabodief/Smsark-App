import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function ContactUsScreen() {
  const handleContact = async (type, url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        Toast.show({
          type: 'success',
          text1: 'نجاح',
          text2: `جاري فتح ${type}...`,
          position: 'top',
          visibilityTime: 5000,
          topOffset: 50,
          text1Style: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
          text2Style: { fontSize: 14, color: '#fff' },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'خطأ',
          text2: `لا يمكن فتح ${type}. تأكدي من تثبيت التطبيق.`,
          position: 'top',
          visibilityTime: 5000,
          topOffset: 50,
          text1Style: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
          text2Style: { fontSize: 14, color: '#fff' },
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'خطأ',
        text2: 'حدث خطأ أثناء محاولة الفتح. حاولي مرة أخرى.',
        position: 'top',
        visibilityTime: 5000,
        topOffset: 50,
        text1Style: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
        text2Style: { fontSize: 14, color: '#fff' },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/contact.webp')}
        style={styles.headerImage}
        resizeMode="contain"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>فريقنا جاهز لمساعدتكم في كل وقت! تواصل معنا عبر الأرقام والحسابات الأتيه</Text>
        <View style={styles.contactList}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('رقم الهاتف', 'tel:+01091070328')}
          >
            <Ionicons name="call-outline" size={20} color="#007BFF" style={styles.icon} />
            <Text style={styles.contactText}>01091070328</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('البريد الإلكتروني', 'mailto:Smsark-App@gmail.com')}
          >
            <Ionicons name="mail-outline" size={20} color="#007BFF" style={styles.icon} />
            <Text style={styles.contactText}>Smsark-App@gmail.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('WhatsApp', 'https://wa.me/01091070328')}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" style={styles.icon} />
            <Text style={styles.contactText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('Instagram', 'https://www.instagram.com/')}
          >
            <Ionicons name="logo-instagram" size={20} color="#E1306C" style={styles.icon} />
            <Text style={styles.contactText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('Twitter', 'https://twitter.com/')}
          >
            <Ionicons name="logo-twitter" size={20} color="#1DA1F2" style={styles.icon} />
            <Text style={styles.contactText}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('Facebook', 'https://www.facebook.com/')}
          >
            <Ionicons name="logo-facebook" size={20} color="#3b5998" style={styles.icon} />
            <Text style={styles.contactText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  headerImage: {
    overflow: 'hidden',
    width: '100%',
    height:300
  },
  contentContainer: {
    width: '100%',
    padding: 20,
    paddingTop: 5, 
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 25,
  },
  contactList: {
    width: '100%',
    flexDirection: 'column',
    gap: 25,
    direction:'rtl'
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap:10
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '500',
  },
});

// تخصيص مظهر التوست
export const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <View style={[styles.toastContainer, { backgroundColor: '#28A745' }]}>
      <Text style={[styles.toastText, { fontSize: 16, fontWeight: 'bold' }]}>{text1}</Text>
      <Text style={[styles.toastText, { fontSize: 14 }]}>{text2}</Text>
    </View>
  ),
  error: ({ text1, text2, ...rest }) => (
    <View style={[styles.toastContainer, { backgroundColor: '#DC3545' }]}>
      <Text style={[styles.toastText, { fontSize: 16, fontWeight: 'bold' }]}>{text1}</Text>
      <Text style={[styles.toastText, { fontSize: 14 }]}>{text2}</Text>
    </View>
  ),
};

const toastStyles = StyleSheet.create({
  toastContainer: {
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    width: '90%',
    alignItems: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
});