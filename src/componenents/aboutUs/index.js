import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import aboutUsHeader from '../../assets/about-us-header.png';
import samsarakOffice from '../../assets/samsarak-office.png';
import clientStory1 from '../../assets/client-story-1.png';
import clientStory2 from '../../assets/client-story-2.png';
import clientStory3 from '../../assets/client-story-3.png';
import propertyCard1 from '../../assets/property-card-1.png';
import propertyCard2 from '../../assets/property-card-2.png';
import propertyCard3 from '../../assets/property-card-3.png';
import Layout from '../../Layout';
const screenWidth = Dimensions.get('window').width;

const aboutUsData = {
  companyName: 'سمسارك',
  slogan: 'بوابتك لعالم العقارات',
  description:
    'سمسارك هي شركة رائدة في مجال التسويق العقاري الرقمي، تأسست عام 2015...',
  features: [
    'تنوع واسع من العقارات',
    'فريق من الخبراء',
    'خدمة عملاء ممتازة',
    'حلول تسويقية مبتكرة',
    'شفافية وموثوقية',
    'سهولة الاستخدام',
  ],
  stats: [
    { value: '5000+', label: 'عقار مباع' },
    { value: '10+', label: 'سنوات خبرة' },
    { value: '1500+', label: 'عميل سعيد' },
  ],
  team: [
    { name: 'محمود يسري', position: 'الرئيس التنفيذي', bio: '...' },
    { name: 'الاء', position: 'مدير التسويق', bio: '...' },
    { name: 'محمد أبو ضيف', position: 'مدير المبيعات', bio: '...' },
  ],
  contactInfo: {
    phone: '+971 50 123 4567',
    email: 'info@samsarak.com',
    address: 'التجمع الخامس, مصر',
  },
  heroText: 'بيتك المثالي هيكون حقيقة مع سمسارك',
  whoIsSamsarakTitle: 'مرحبًا بك في سمسارك',
  whoIsSamsarakDescription:
    'تأسست سمسارك على يد مجموعة من المهندسين المصريين بخبرة واسعة في مجال العقارات...',
  clientStoriesTitle: 'قصص عملائنا',
  clientStories: [
    {
      image: clientStory1,
      text: 'تجربة ممتازة مع سمسارك!',
      author: 'أحمد محمود',
      location: 'القاهرة',
    },
    {
      image: clientStory2,
      text: 'وجدنا منزل أحلامنا بسهولة!',
      author: 'ليلى محمد',
      location: 'الإسكندرية',
    },
    {
      image: clientStory3,
      text: 'أفضل خدمة عقارية على الإطلاق.',
      author: 'خالد منصور',
      location: 'مدينة السادات',
    },
  ],
  heroProperties: [
    {
      image: propertyCard1,
      type: 'فيلا سكنية',
      location: 'التجمع الخامس',
      price: '2,500,000 جنيه',
    },
    {
      image: propertyCard2,
      type: 'شقة فاخرة',
      location: 'الإسكندرية',
      price: '1,200,000 جنيه',
    },
    {
      image: propertyCard3,
      type: 'أرض تجارية',
      location: 'مدينة نصر',
      price: '5,000,000 جنيه',
    },
  ],
};

const AboutUsScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  const handleBrowseProperties = () => {
    navigation.navigate('Home');
  };

  const handleContactUs = () => {
    navigation.navigate('Contact');
  };

  return (
    <Layout>
    <ScrollView style={styles.container}>
      {/* Header */}
      <Image source={aboutUsHeader} style={styles.headerImage} />
      <View style={styles.overlay}>
        <Text style={styles.companyName}>{aboutUsData.companyName}</Text>
        <Text style={styles.slogan}>{aboutUsData.slogan}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleBrowseProperties} style={styles.primaryButton}>
            <Text style={styles.buttonText}>تصفح العقارات</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContactUs} style={styles.outlinedButton}>
            <Text style={styles.outlinedText}>تواصل معنا</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Image source={samsarakOffice} style={styles.aboutImage} />
        <Text style={styles.title}>{aboutUsData.whoIsSamsarakTitle}</Text>
        <Text style={styles.text}>{aboutUsData.whoIsSamsarakDescription}</Text>
      </View>

      {/* Hero Properties */}
      <View style={styles.section}>
        <Text style={styles.heroText}>{aboutUsData.heroText}</Text>
        <FlatList
          horizontal
          data={aboutUsData.heroProperties}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.propertyCard}>
              <Image source={item.image} style={styles.propertyImage} />
              <Text style={styles.propertyType}>{item.type}</Text>
              <Text>{item.location}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Client Stories */}
      <View style={styles.section}>
        <Text style={styles.title}>{aboutUsData.clientStoriesTitle}</Text>
        <FlatList
          horizontal
          data={aboutUsData.clientStories}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.storyCard}>
              <Image source={item.image} style={styles.storyImage} />
              <Text style={styles.text}>"{item.text}"</Text>
              <Text style={styles.author}>{item.author}</Text>
              <Text>{item.location}</Text>
            </View>
          )}
          ref={sliderRef}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.title}>لماذا تختار {aboutUsData.companyName}؟</Text>
        {aboutUsData.features.map((feature, index) => (
          <Text key={index} style={styles.bullet}>
            • {feature}
          </Text>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        {aboutUsData.stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Team */}
      <View style={styles.section}>
        <Text style={styles.title}>فريقنا</Text>
        {aboutUsData.team.map((member, index) => (
          <View key={index} style={styles.teamCard}>
            <Text style={styles.author}>{member.name}</Text>
            <Text>{member.position}</Text>
            <Text style={styles.text}>{member.bio}</Text>
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.title}>تواصل معنا</Text>
        <Text>📞 {aboutUsData.contactInfo.phone}</Text>
        <Text>📧 {aboutUsData.contactInfo.email}</Text>
        <Text>📍 {aboutUsData.contactInfo.address}</Text>
      </View>
    </ScrollView>
    </Layout>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImage: { width: '100%', height: 250 },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  companyName: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
  slogan: { fontSize: 18, color: '#fff', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  primaryButton: {
    backgroundColor: '#673ab7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: { color: 'white' },
  outlinedText: { color: 'white' },
  section: { padding: 20 },
  aboutImage: { width: '100%', height: 200, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
  text: { fontSize: 16, marginBottom: 10, textAlign: 'right' },
  heroText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  propertyCard: {
    width: 200,
    marginRight: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  propertyImage: { width: '100%', height: 100, marginBottom: 10 },
  propertyType: { fontWeight: 'bold' },
  price: { color: '#673ab7', fontWeight: 'bold' },
  storyCard: {
    width: 250,
    padding: 10,
    backgroundColor: '#eee',
    marginRight: 10,
    borderRadius: 10,
  },
  storyImage: { width: '100%', height: 100, marginBottom: 10 },
  author: { fontWeight: 'bold' },
  bullet: { fontSize: 16, textAlign: 'right' },
  statsSection: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 14 },
  teamCard: {
    padding: 10,
    backgroundColor: '#fafafa',
    marginVertical: 5,
    borderRadius: 10,
  },
});
