import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { annotazioniAPI } from '../services/api';

// Thunk per ottenere tutte le annotazioni
export const fetchAnnotazioni = createAsyncThunk(
  'annotazioni/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nel caricamento delle annotazioni');
    }
  }
);

// Thunk per ottenere una singola annotazione
export const fetchAnnotazioneById = createAsyncThunk(
  'annotazioni/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Annotazione non trovata');
    }
  }
);

// Thunk per creare una nuova annotazione
export const createAnnotazione = createAsyncThunk(
  'annotazioni/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nella creazione dell\'annotazione');
    }
  }
);

// Thunk per aggiornare un'annotazione
export const updateAnnotazione = createAsyncThunk(
  'annotazioni/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nell\'aggiornamento dell\'annotazione');
    }
  }
);

// Thunk per eliminare un'annotazione
export const deleteAnnotazione = createAsyncThunk(
  'annotazioni/delete',
  async (id, { rejectWithValue }) => {
    try {
      await annotazioniAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nell\'eliminazione dell\'annotazione');
    }
  }
);

// Thunk per prenotare un'annotazione
export const prenotaAnnotazione = createAsyncThunk(
  'annotazioni/prenota',
  async ({ id, utente, secondi }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.prenota(id, utente, secondi);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nella prenotazione');
    }
  }
);

// Thunk per rilasciare prenotazione
export const rilasciaPrenotazione = createAsyncThunk(
  'annotazioni/rilascia',
  async ({ id, utente }, { rejectWithValue }) => {
    try {
      await annotazioniAPI.rilasciaPrenotazione(id, utente);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nel rilascio della prenotazione');
    }
  }
);

// Thunk per cambiare stato
export const cambiaStato = createAsyncThunk(
  'annotazioni/cambiaStato',
  async ({ id, vecchioStato, nuovoStato, utente }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.cambiaStato(id, { vecchioStato, nuovoStato, utente });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nel cambio di stato');
    }
  }
);

// Thunk per ottenere transizioni stato
export const fetchTransizioniStato = createAsyncThunk(
  'annotazioni/fetchTransizioni',
  async (_, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.getTransizioniStato();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore nel caricamento delle transizioni');
    }
  }
);

const annotazioniSlice = createSlice({
  name: 'annotazioni',
  initialState: {
    items: [],
    selectedAnnotazione: null,
    transizioni: [],
    loading: false,
    error: null,
    prenotazioni: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAnnotazione: (state) => {
      state.selectedAnnotazione = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAnnotazioni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnotazioni.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAnnotazioni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchAnnotazioneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnotazioneById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnnotazione = action.payload;
      })
      .addCase(fetchAnnotazioneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createAnnotazione.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateAnnotazione.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedAnnotazione = action.payload;
      })
      // Delete
      .addCase(deleteAnnotazione.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Prenota
      .addCase(prenotaAnnotazione.fulfilled, (state, action) => {
        state.prenotazioni[action.payload.id] = action.payload.data;
      })
      // Rilascia
      .addCase(rilasciaPrenotazione.fulfilled, (state, action) => {
        delete state.prenotazioni[action.payload];
      })
      // Cambia stato
      .addCase(cambiaStato.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Fetch transizioni
      .addCase(fetchTransizioniStato.fulfilled, (state, action) => {
        state.transizioni = action.payload;
      });
  },
});

export const { clearError, clearSelectedAnnotazione } = annotazioniSlice.actions;
export default annotazioniSlice.reducer;
