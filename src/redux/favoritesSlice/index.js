import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Favorite from '../../../FireBase/modelsWithOperations/Favorite';
import FinancingAdvertisement from '../../../FireBase/modelsWithOperations/FinancingAdvertisement';
import RealEstateDeveloperAdvertisement from '../../../FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement';
export const loadFavoritesAsync = createAsyncThunk(
  'favorites/loadFavorites',
  async () => {
    return new Promise((resolve) => {
      Favorite.subscribeByUser('guest', async (favorites) => {
        const detailedFavorites = await Promise.all(
          favorites.map(async (fav) => {
            let data;
            // نجرب كل نوع حتى نلاقي بيانات
            data = await FinancingAdvertisement.getById(fav.advertisement_id);
            if (!data) {
              data = await RealEstateDeveloperAdvertisement.getById(fav.advertisement_id);
            }


            return {
              ...data,
              advertisement_id: fav.advertisement_id,
              // type: fav.type || 'financing',
            };
          })
        );

        resolve(detailedFavorites);
      });
    });
  }
);


export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggleFavorite',
  async (item, { getState }) => {
    const { advertisement_id } = item;

    // تنفيذ التبديل في Firebase بدون انتظار البيانات الجديدة
    await Favorite.toggleFavorite('guest', advertisement_id);

    // تحديث الحالة محليًا بناءً على الحالة الحالية
    const state = getState();
    const currentFavorites = state.favorites.list;

    const isFavorite = currentFavorites.some(fav => fav.advertisement_id === advertisement_id);

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = currentFavorites.filter(fav => fav.advertisement_id !== advertisement_id);
    } else {
      // لو نوع الإعلان مش واضح هنا، ضيفه في الزر نفسه أو استخرج بياناته من المكان المعروض فيه
      updatedFavorites = [...currentFavorites, item];
    }

    return updatedFavorites;
  }
);


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
        state.list = action.payload; // تحديث القائمة بعد التبديل
      });
  }


});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;


// stop_________________________________________