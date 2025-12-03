import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Thunk per il login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(username, password);
      const { token, username: user, email, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username: user, email, role }));
      return { token, user: { username: user, email, role } };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore durante il login');
    }
  }
);

// Thunk per il logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      // Anche in caso di errore, rimuoviamo i dati locali
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  }
);

// Thunk per il profilo
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nel recupero del profilo');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
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
        state.error = action.payload;
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
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
