import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import annotazioniReducer from '../store/annotazioniSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    annotazioni: annotazioniReducer,
  },
});
