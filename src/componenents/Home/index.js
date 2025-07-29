import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SimpleHeroSlider from '../../Homeparts/Hero';
import Needs from '../../Homeparts/needs';
import Advertise from '../../Homeparts/adv';
import BestFin from '../../Homeparts/BestFin';
import BestDev from '../../Homeparts/BestDev';
import Nav from '../Nav';
import Layout from '../../Layout';
export default function Home() {
  return (
    <Layout>
    <View style={{ flex: 1 }}>
      {/* النافبار خارج الفلات ليست */}
      {/* <Nav /> */}

      <FlatList
        data={[]} // لا حاجة لعناصر هنا
        renderItem={null}
        keyExtractor={() => "header-only"}
        ListHeaderComponent={
          <View style={styles.container}>
            <SimpleHeroSlider />
            <BestFin />
            <BestDev />
            <Needs />
            <Advertise />
          </View>
        }
      />
    </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    backgroundColor: '#fff',
  },
});
