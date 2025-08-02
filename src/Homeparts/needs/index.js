import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const cards = [
  {
    icon: 'business',
    title: 'شراء',
    desc: 'استكشف آلاف العقارات المتاحة للشراء.',
    path: 'Sell',
  },
  {
    icon: 'vpn-key',
    title: 'تأجير',
    desc: 'قم بتأجير عقارك الآن للوصول للمستأجر المناسب.',
    path: 'Sell',
  },
  {
    icon: 'attach-money',
    title: 'تطوير',
    desc: 'احصل على حلول تطويريه مخصصة لك بسهولة.',
    path: 'developer',
  },
  {
    icon: 'attach-money',
    title: 'تمويل',
    desc: 'احصل على حلول تمويلية مخصصة لك بسهولة.',
    path: 'financing',
  },
];

const Needs = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.icon} size={32} color="gray" />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.desc}>{item.desc}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainStack', { screen: item.path })}
      >
        <MaterialIcons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ماذا تريد؟</Text>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#200D3A',
    paddingVertical: 24,
    padding:16,
    flex: 1,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#2E1C4F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    justifyContent: 'space-between',
    minHeight: 180,
  },
  iconContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginRight: 8,
  },
  desc: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#5A3FC0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});

export default Needs;
