import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import SimpleHeroSlider from '../../Homeparts/Hero';
import Needs from '../../Homeparts/needs';
import Advertise from '../../Homeparts/adv';
import BestFin from '../../Homeparts/BestFin';
import BestDev from '../../Homeparts/BestDev';
import Layout from '../../Layout';
import { useTheme } from '@react-navigation/native';

export default function Home() {
  const { colors } = useTheme(); // خليه هنا مش جوه الدالة التانية

  return (
    <Layout>
      <View style={{ flex: 1 }}>
        <FlatList
          data={[]} // لا حاجة لعناصر هنا
          renderItem={null}
          keyExtractor={() => "header-only"}
          ListHeaderComponent={
            <View style={{ backgroundColor: colors.background }}>
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
