import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, getErrorMessage } from '../services/api';
import type { User } from '../types';

// localStorage non esiste fuori dal browser (es. nei test con Vitest in ambiente node)
const readStorage = (key: string): string | null =>
  typeof localStorage === 'undefined' ? null : localStorage.getItem(key);

const clearStorage = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Thunk per il login
export const login = createAsyncThunk<
  { token: string; user: User },
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(username, password);
    const { token, username: user, email, role } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ username: user, email, role }));
    return { token, user: { username: user, email, role } };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Errore durante il login'));
  }
});

// Thunk per il logout
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authAPI.logout();
  } catch {
    // Anche in caso di errore del backend l'utente viene disconnesso
  }
  clearStorage();
  return null;
});

// Thunk per il profilo
export const getProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Errore nel recupero del profilo'));
    }
  },
);

export const getInitialAuthState = (): AuthState => {
  const token = readStorage('token');
  return {
    token,
    user: JSON.parse(readStorage('user') || 'null') as User | null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Errore durante il login';
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Errore nel recupero del profilo';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
