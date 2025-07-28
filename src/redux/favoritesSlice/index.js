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
  async (item) => {
    const { advertisement_id, } = item;

    // حذف أو إضافة في فايربيز (هنمرر النوع في الكود لكن مش هنغير كلاس Favorite)
    await Favorite.toggleFavorite('guest', advertisement_id);

    // نرجع الليست المحدثة كلها بعد التبديل
    return new Promise((resolve) => {
      Favorite.subscribeByUser('guest', (favorites) => {
        const formatted = favorites.map((fav) => ({
          advertisement_id: fav.advertisement_id,
          // type: fav.type || 'financing', // لازم النوع يرجع
        }));
        resolve(formatted);
      });
    });

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