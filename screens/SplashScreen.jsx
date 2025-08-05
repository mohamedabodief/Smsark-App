import React, { useRef } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  const animationPlayed = useRef(false); 
  const animationRef = useRef(null); 
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6A0DAD" barStyle="light-content" />
      <Animatable.Image
        ref={animationRef}
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        animation={animationPlayed.current ? undefined : 'zoomIn'}
        duration={2000}
        iterationCount={1}
        onAnimationBegin={() => {
          animationPlayed.current = true; 
        }}
        onAnimationEnd={() => {
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A0DAD', 
  },
  logo: {
    width: '100%',
    height: 500,
    marginBottom: 30,
  },
});

export default SplashScreen;