import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

const StatusBarComponent = ({ children, backgroundColor = '#ffffff', barStyle = 'dark-content' }) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={barStyle} backgroundColor={backgroundColor} translucent={false} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight, 
  },
  content: {
    flex: 1,
  },
});

export default StatusBarComponent;