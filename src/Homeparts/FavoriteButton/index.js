import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAsync, loadFavoritesAsync } from '../../redux/favoritesSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import User from '../../../FireBase/modelsWithOperations/User';
import { auth } from '../../../FireBase/firebaseConfig';
const FavoriteButton = ({ advertisementId }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.list);
  const userId = auth.currentUser?.uid;

  // useEffect(() => {
  //   dispatch(loadFavoritesAsync());
  // }, [
  //   // dispatch
  // ]);

  const isFavorite = favorites.some(
  (fav) => String(fav.advertisement_id) === String(advertisementId)
);


  const handleToggleFavorite = () => {
    if (!userId) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }
    dispatch(toggleFavoriteAsync({ userId, advertisementId }));
  }
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

// import React, { useEffect } from 'react';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavoriteAsync, loadFavoritesAsync } from '../../redux/favoritesSlice';
// import { Ionicons } from '@expo/vector-icons';
// import { useRoute } from '@react-navigation/native';

// const FavoriteButton = ({ id }) => {
//   const dispatch = useDispatch();
//   const route = useRoute();
//   const favorites = useSelector((state) => state.favorites.list);

//   useEffect(() => {
//     dispatch(loadFavoritesAsync());
//   }, []);

//   const isFavorite = favorites.some((fav) => fav.advertisement_id === id);

//   const isInFavoritesScreen = route.name === 'Favorite';

//   const handleToggleFavorite = () => {
//     if (isInFavoritesScreen && isFavorite) {
//       // في شاشة المفضلة: احذف فقط
//       dispatch(toggleFavoriteAsync({ advertisement_id: id }));
//     } else {
//       // في أي شاشة تانية: أضف أو احذف
//       dispatch(toggleFavoriteAsync({ advertisement_id: id }));
//     }
//   };

//   return (
//     <TouchableOpacity onPress={handleToggleFavorite} style={styles.button}>
//       <Ionicons
//         name={isFavorite ? 'heart' : 'heart-outline'}
//         size={24}
//         color={isFavorite ? 'red' : 'gray'}
//       />
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 5,
//     zIndex: 1,
//   },
// });

// export default FavoriteButton;


// //stop____________________