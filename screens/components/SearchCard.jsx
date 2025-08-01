import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import FavoriteButton from '../../src/Homeparts/FavoriteButton';
const SearchCard = ({ name, price, imageUrl, location, type, id }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageWrapper} >
        <Image source={{ uri: imageUrl }} style={styles.image} height={'100%'} />
        <TouchableOpacity style={styles.heartIcon}>
          <FontAwesome name="heart-o" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <View style={styles.typeContainer}>
          <Text style={styles.type}>{type}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        {/* {location && (
        <Text style={styles.location}>
          <MaterialIcons name="location-pin" size={14} color="#999" /> {location}
        </Text>
        )} */}
        {location && (
          <Text style={styles.location}>
            <MaterialIcons name="location-pin" size={14} color="#999" />
            {typeof location === 'string' ? location : `${location?.governorate || ''} - ${location?.city || ''}`}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>${price} <Text style={styles.perNight}></Text></Text>
        </View>
      </View>
      <FavoriteButton advertisementId={id} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 5,
    marginHorizontal: 5,
    elevation: 3,
    direction: 'rtl'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 10
  },
  typeContainer: {
    backgroundColor: '#e6f0ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4
  },
  type: {
    fontSize: 12,
    color: '#007BFF'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: 14,
    color: '#ff5733',
    fontWeight: 'bold'
  },
  perNight: {
    color: '#888',
    fontSize: 12
  },
  stars: {
    flexDirection: 'row'
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 130,
    overflow: 'hidden',
  },

  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
});

export default SearchCard;
