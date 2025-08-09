import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Favorite from '../../../FireBase/modelsWithOperations/Favorite';
import FinancingAdvertisement from '../../../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';

// حفظ في AsyncStorage
const saveFavoritesToStorage = async (favorites) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
  }
};

// تحميل من AsyncStorage
const loadFavoritesFromStorage = async () => {
  try {
    const json = await AsyncStorage.getItem('favorites');
    return json ? JSON.parse(json) : [];
  } catch (error) {
    return [];
  }
};

export const loadFavoritesAsync = createAsyncThunk(
  'favorites/loadFavorites',
  async (_, { getState }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    return new Promise((resolve) => {
      Favorite.subscribeByUser(userId, async (favorites) => {
        if (!favorites || favorites.length === 0) {
          resolve([]);
          return;
        }

        const detailedFavorites = await Promise.all(
          favorites.map(async (fav) => {
            let data =
              (await FinancingAdvertisement.getById(fav.advertisement_id)) ||
              (await RealEstateDeveloperAdvertisement.getById(fav.advertisement_id)) ||
              (await ClientAdvertisement.getById(fav.advertisement_id));

            return data ? { ...data, advertisement_id: fav.advertisement_id } : null;
          })
        );

        const result = detailedFavorites.filter(Boolean);
        resolve(result);
      });
    });
  }
);
export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ userId, advertisementId }, { dispatch }) => {
    await Favorite.toggleFavorite(userId, advertisementId);
    
    // بعد التغيير، أعد تحميل القائمة
    const favorites = await new Promise((resolve) => {
      Favorite.subscribeByUser(userId, (favs) => {
        resolve(favs.map(f => ({ advertisement_id: f.advertisement_id }))); // مؤقتًا بدون تحميل تفاصيل كاملة
      });
    });

    return favorites;
  }
);



// export const toggleFavoriteAsync = createAsyncThunk(
//   'favorites/toggleFavorite',
//   async ({ userId, advertisementId }, { getState }) => {
//     await Favorite.toggleFavorite(userId, advertisementId);

//     const state = getState();
//     const currentFavorites = state.favorites.list;
    
//     const isFavorite = currentFavorites.some(
//       (fav) => String(fav.advertisement_id) === String(advertisementId)
//     );

//     let updatedFavorites;
//     if (isFavorite) {
//       updatedFavorites = currentFavorites.filter(
//         (fav) => String(fav.advertisement_id) !== String(advertisementId)
//       );
//     } else {
//       const data =
//         (await FinancingAdvertisement.getById(advertisementId)) ||
//         (await RealEstateDeveloperAdvertisement.getById(advertisementId)) ||
//         (await ClientAdvertisement.getById(advertisementId));
//       console.log('Fetched ad data:', data);
//       if (!data) return currentFavorites;

//       updatedFavorites = [...currentFavorites, { ...data, advertisement_id: advertisementId }];

//     }

//     return updatedFavorites;
//   }
  
// );



const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: [],
  },
  reducers: {
    setFavorites(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavoritesAsync.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import Favorite from '../../../FireBase/modelsWithOperations/Favorite';
// import FinancingAdvertisement from '../../../FireBase/modelsWithOperations/FinancingAdvertisement';
// import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
// export const loadFavoritesAsync = createAsyncThunk(
//   'favorites/loadFavorites',
//   async () => {
//     return new Promise((resolve) => {
//       Favorite.subscribeByUser('guest', async (favorites) => {
//         const detailedFavorites = await Promise.all(
//           favorites.map(async (fav) => {
//             let data;
//             // نجرب كل نوع حتى نلاقي بيانات
//             data = await FinancingAdvertisement.getById(fav.advertisement_id);
//             if (!data) {
//               data = await RealEstateDeveloperAdvertisement.getById(fav.advertisement_id);
//             }


//             return {
//               ...data,
//               advertisement_id: fav.advertisement_id,
//               // type: fav.type || 'financing',
//             };
//           })
//         );

//         resolve(detailedFavorites);
//       });
//     });
//   }
// );


// export const toggleFavoriteAsync = createAsyncThunk(
//   'favorites/toggleFavorite',
//   async (item, { getState }) => {
//     const { advertisement_id } = item;

//     // تنفيذ التبديل في Firebase بدون انتظار البيانات الجديدة
//     await Favorite.toggleFavorite('guest', advertisement_id);

//     // تحديث الحالة محليًا بناءً على الحالة الحالية
//     const state = getState();
//     const currentFavorites = state.favorites.list;

//     const isFavorite = currentFavorites.some(fav => fav.advertisement_id === advertisement_id);

//     let updatedFavorites;
//     if (isFavorite) {
//       updatedFavorites = currentFavorites.filter(fav => fav.advertisement_id !== advertisement_id);
//     } else {
//       // لو نوع الإعلان مش واضح هنا، ضيفه في الزر نفسه أو استخرج بياناته من المكان المعروض فيه
//       updatedFavorites = [...currentFavorites, item];
//     }

//     return updatedFavorites;
//   }
// );


// const favoritesSlice = createSlice({
//   name: 'favorites',
//   initialState: {
//     list: [],
//   },
//   reducers: {
//     setFavorites(state, action) {
//       state.list = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadFavoritesAsync.fulfilled, (state, action) => {
//         state.list = action.payload;
//       })
//       .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
//         state.list = action.payload; // تحديث القائمة بعد التبديل
//       });
//   }


// });

// export const { setFavorites } = favoritesSlice.actions;
// export default favoritesSlice.reducer;


// // stop_________________________________________