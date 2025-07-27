import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAsync, loadFavoritesAsync } from '../../redux/favoritesSlice';
import { Ionicons } from '@expo/vector-icons';

const FavoriteButton = ({ id, type }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.list);

  useEffect(() => {
    dispatch(loadFavoritesAsync());
  }, []);

  const isFavorite = favorites.some(
  (fav) =>
    fav.advertisement_id === id &&
    (fav.type || 'financing') === (type || 'financing')
);


  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteAsync({ advertisement_id: id, type }));
    // لا حاجة لإعادة loadFavorites هنا لأن toggleFavoriteAsync يعيدها
  };

  return (
    <TouchableOpacity onPress={handleToggleFavorite} style={styles.button}>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={isFavorite ? 'red' : 'gray'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
  },
});

export default FavoriteButton;
