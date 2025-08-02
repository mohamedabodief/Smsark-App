import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SelectUserTypeScreen({ route, navigation }) {
  const { uid } = route.params;
  const [selectedType, setSelectedType] = useState(null); // 'client' أو 'organization'

  const handleNext = () => {
    if (selectedType === 'client') {
      navigation.navigate('ClientDetails', { uid });
    } else if (selectedType === 'organization') {
      navigation.navigate('OrganizationDetails', { uid });
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg-sign.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>اختر نوع الحساب:</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.customButton,
                selectedType === 'client' && styles.selectedButton
              ]}
              onPress={() => setSelectedType('client')}
            >
              <Ionicons
                name="person-outline"
                size={28}
                color={selectedType === 'client' ? '#fff' : '#6E00FE'}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.buttonText,
                  selectedType === 'client' && styles.selectedButtonText
                ]}
              >
                عميل
              </Text>
            </TouchableOpacity>

            <View style={{ height: 10 }} />

            <TouchableOpacity
              style={[
                styles.customButton,
                selectedType === 'organization' && styles.selectedButton
              ]}
              onPress={() => setSelectedType('organization')}
            >
              <Ionicons
                name="business-outline"
                size={28}
                color={selectedType === 'organization' ? '#fff' : '#6E00FE'}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.buttonText,
                  selectedType === 'organization' && styles.selectedButtonText
                ]}
              >
                مؤسسة
              </Text>
            </TouchableOpacity>

           <TouchableOpacity
  style={[
    styles.nextButton,
    !selectedType && styles.disabledButton
  ]}
  onPress={handleNext}
  disabled={!selectedType}
>
  <Text
    style={[
      styles.nextButtonText,
      !selectedType && styles.disabledButtonText
    ]}
  >
    التالي
  </Text>
</TouchableOpacity>

          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E00FE',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6E00FE',
    direction: 'rtl',
    gap: 8,
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#6E00FE',
  },
  buttonText: {
    fontSize: 18,
    color: '#6E00FE',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: '#5A00D6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
  backgroundColor: '#CBB8F0',
},

disabledButtonText: {
  color: '#f3ebff',
},
});
