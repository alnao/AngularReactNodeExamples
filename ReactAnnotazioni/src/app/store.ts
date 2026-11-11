import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import annotazioniReducer from '../store/annotazioniSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  annotazioni: annotazioniReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/** Crea uno store nuovo: usato dall'app e dai test (stato iniziale opzionale). */
export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
