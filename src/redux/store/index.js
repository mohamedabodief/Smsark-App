// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from '../favoritesSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer, // ✅ لازم يكون بنفس الاسم المستخدم في useSelector
  },
});
