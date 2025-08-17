import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const StatusBarComponent = ({
  children,
  backgroundColor = "#ffffff",
  barStyle = "dark", 
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.statusBarBackground, { backgroundColor }]} />
      <StatusBar style={barStyle} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    height: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
  },
});

export default StatusBarComponent;
