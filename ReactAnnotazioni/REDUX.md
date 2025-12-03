# Redux - Guida Completa del Progetto Annotazioni

## Indice
1. [Introduzione a Redux](#introduzione-a-redux)
2. [Struttura Redux nel Progetto](#struttura-redux-nel-progetto)
3. [Redux Toolkit](#redux-toolkit)
4. [Store Configurazione](#store-configurazione)
5. [Slices](#slices)
6. [Thunks (Azioni Asincrone)](#thunks-azioni-asincrone)
7. [Utilizzo nei Componenti](#utilizzo-nei-componenti)

---

## Introduzione a Redux

**Redux** è una libreria per la gestione dello stato globale dell'applicazione. Permette di:
- Centralizzare lo stato dell'applicazione in un unico "store"
- Rendere lo stato prevedibile e tracciabile
- Facilitare il debug e il testing
- Condividere dati tra componenti senza prop drilling

### Concetti Base

```
┌─────────────┐
│   STORE     │  ← Contiene tutto lo stato dell'app
└─────────────┘
      ↓
┌─────────────┐
│   STATE     │  ← Dati attuali (items, user, loading, etc.)
└─────────────┘
      ↓
┌─────────────┐
│  ACTIONS    │  ← Azioni che modificano lo stato (fetchAnnotazioni, login, etc.)
└─────────────┘
      ↓
┌─────────────┐
│  REDUCERS   │  ← Funzioni pure che aggiornano lo stato in base alle azioni
└─────────────┘
```

---

## Struttura Redux nel Progetto

```
src/
├── store/
│   ├── index.js              # Configurazione dello store
│   ├── authSlice.js          # Gestione autenticazione
│   └── annotazioniSlice.js   # Gestione annotazioni
```

---

## Redux Toolkit

Questo progetto usa **Redux Toolkit**, che semplifica Redux con:
- `configureStore()` - Configura lo store con opzioni predefinite
- `createSlice()` - Crea automaticamente actions e reducers
- `createAsyncThunk()` - Gestisce azioni asincrone (API calls)

---

## Store Configurazione

**File: `src/store/index.js`**

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import annotazioniReducer from './annotazioniSlice';

// Configurazione dello store globale
const store = configureStore({
  reducer: {
    auth: authReducer,           // Stato dell'autenticazione
    annotazioni: annotazioniReducer  // Stato delle annotazioni
  }
});

export default store;
```

**Spiegazione:**
- `configureStore()` crea lo store con Redux DevTools abilitato automaticamente
- Ogni reducer gestisce una "fetta" (slice) dello stato
- Lo stato globale ha questa struttura:
  ```javascript
  {
    auth: { user, token, loading, error },
    annotazioni: { items, selectedAnnotazione, transizioni, loading, error }
  }
  ```

---

## Slices

### Auth Slice

**File: `src/store/authSlice.js`**

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// ============================================
// THUNK: Azione asincrona per il login
// ============================================
export const login = createAsyncThunk(
  'auth/login',  // Nome univoco dell'azione
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Chiamata API
      const response = await authAPI.login(username, password);
      
      // Salva il token nel localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;  // Ritorna i dati al reducer
    } catch (error) {
      // In caso di errore, ritorna il messaggio
      return rejectWithValue(error.response?.data?.message || 'Errore nel login');
    }
  }
);

// ============================================
// SLICE: Definisce stato iniziale e reducers
// ============================================
const authSlice = createSlice({
  name: 'auth',
  
  // Stato iniziale
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  
  // Reducers sincroni
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  
  // Extra reducers per gestire i thunks
  extraReducers: (builder) => {
    builder
      // Quando il login parte (stato pending)
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Quando il login ha successo (stato fulfilled)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Quando il login fallisce (stato rejected)
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

**Spiegazione dei 3 stati dei Thunks:**
```javascript
dispatch(login({ username, password }))
  ↓
1. login.pending    → loading = true
  ↓
2. API call
  ↓
3a. login.fulfilled  → loading = false, user e token salvati
   oppure
3b. login.rejected   → loading = false, error salvato
```

---

### Annotazioni Slice

**File: `src/store/annotazioniSlice.js`**

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { annotazioniAPI } from '../services/api';

// ============================================
// THUNKS: Azioni asincrone
// ============================================

// Recupera tutte le annotazioni
export const fetchAnnotazioni = createAsyncThunk(
  'annotazioni/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.getAll();
      return response.data;  // Array di annotazioni
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Recupera una singola annotazione per ID
export const fetchAnnotazioneById = createAsyncThunk(
  'annotazioni/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Crea una nuova annotazione
export const createAnnotazione = createAsyncThunk(
  'annotazioni/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Aggiorna un'annotazione esistente
export const updateAnnotazione = createAsyncThunk(
  'annotazioni/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Cambia lo stato di un'annotazione
export const cambiaStato = createAsyncThunk(
  'annotazioni/cambiaStato',
  async ({ id, vecchioStato, nuovoStato, utente }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.cambiaStato(
        id, 
        vecchioStato, 
        nuovoStato, 
        utente
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Prenota un'annotazione per la modifica
export const prenotaAnnotazione = createAsyncThunk(
  'annotazioni/prenota',
  async ({ id, utente, secondi }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.prenotaAnnotazione(
        id, 
        utente, 
        secondi
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Rilascia la prenotazione di un'annotazione
export const rilasciaPrenotazione = createAsyncThunk(
  'annotazioni/rilascia',
  async ({ id, utente }, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.rilasciaPrenotazione(id, utente);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// Recupera le transizioni di stato disponibili
export const fetchTransizioniStato = createAsyncThunk(
  'annotazioni/fetchTransizioni',
  async (_, { rejectWithValue }) => {
    try {
      const response = await annotazioniAPI.getTransizioniStato();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Errore');
    }
  }
);

// ============================================
// SLICE
// ============================================
const annotazioniSlice = createSlice({
  name: 'annotazioni',
  
  initialState: {
    items: [],                    // Lista di tutte le annotazioni
    selectedAnnotazione: null,    // Annotazione correntemente selezionata
    transizioni: [],              // Transizioni di stato disponibili
    loading: false,               // Indica se un'operazione è in corso
    error: null,                  // Messaggio di errore
    prenotazioni: {}              // Mappa id -> info prenotazione
  },
  
  // Reducers sincroni
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAnnotazione: (state) => {
      state.selectedAnnotazione = null;
    }
  },
  
  // Gestione dei thunks
  extraReducers: (builder) => {
    builder
      // ========== Fetch All ==========
      .addCase(fetchAnnotazioni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnotazioni.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;  // Salva tutte le annotazioni
      })
      .addCase(fetchAnnotazioni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== Fetch By ID ==========
      .addCase(fetchAnnotazioneById.fulfilled, (state, action) => {
        state.selectedAnnotazione = action.payload;  // Salva l'annotazione selezionata
      })
      
      // ========== Create ==========
      .addCase(createAnnotazione.fulfilled, (state, action) => {
        state.items.push(action.payload);  // Aggiunge la nuova annotazione alla lista
      })
      
      // ========== Update ==========
      .addCase(updateAnnotazione.fulfilled, (state, action) => {
        // Trova e aggiorna l'annotazione nella lista
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Aggiorna anche quella selezionata se corrisponde
        if (state.selectedAnnotazione?.id === action.payload.id) {
          state.selectedAnnotazione = action.payload;
        }
      })
      
      // ========== Transizioni ==========
      .addCase(fetchTransizioniStato.fulfilled, (state, action) => {
        state.transizioni = action.payload;  // Salva le transizioni
      });
  }
});

export const { clearError, clearSelectedAnnotazione } = annotazioniSlice.actions;
export default annotazioniSlice.reducer;
```

---

## Utilizzo nei Componenti

### Esempio completo da ElencoAnnotazioni.js

```javascript
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAnnotazioni,
  fetchAnnotazioneById,
  updateAnnotazione
} from '../store/annotazioniSlice';

const ElencoAnnotazioni = () => {
  // ============================================
  // 1. ACCESSO ALLO STORE
  // ============================================
  
  const dispatch = useDispatch();  // Per inviare azioni
  
  // Legge dati dallo store
  const { items, selectedAnnotazione, loading, error } = useSelector(
    (state) => state.annotazioni
  );
  const { user } = useSelector((state) => state.auth);
  
  // ============================================
  // 2. CHIAMARE UN THUNK
  // ============================================
  
  useEffect(() => {
    // Dispatch di un thunk al montaggio del componente
    dispatch(fetchAnnotazioni());
  }, [dispatch]);
  
  // ============================================
  // 3. GESTIRE UN'AZIONE ASINCRONA
  // ============================================
  
  const handleSelectChange = async (option) => {
    if (option) {
      // dispatch ritorna una Promise
      await dispatch(fetchAnnotazioneById(option.value));
      
      // Dopo che i dati sono stati caricati, puoi fare altre operazioni
      setEditMode(true);
    }
  };
  
  // ============================================
  // 4. GESTIRE SUCCESSO E ERRORE
  // ============================================
  
  const handleSave = async () => {
    try {
      // .unwrap() estrae il payload o lancia un errore
      await dispatch(updateAnnotazione({
        id: selectedAnnotazione.id,
        data: formData
      })).unwrap();
      
      // Se arriviamo qui, l'operazione ha avuto successo
      alert('Salvato con successo!');
      
    } catch (err) {
      // Se c'è un errore, viene catturato qui
      alert(`Errore: ${err}`);
    }
  };
  
  return (
    <div>
      {/* Mostra loading */}
      {loading && <div>Caricamento...</div>}
      
      {/* Mostra errore */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Mostra dati */}
      {items.map(item => (
        <div key={item.id}>{item.descrizione}</div>
      ))}
    </div>
  );
};
```

---

## Flusso Completo di un'Operazione

### Esempio: Salvare un'annotazione

```javascript
// 1. L'utente clicca "Salva"
<button onClick={handleSave}>Salva</button>

// 2. Il componente chiama il thunk
const handleSave = async () => {
  dispatch(updateAnnotazione({ id: 123, data: formData }))
}

// 3. Redux Toolkit fa la chiamata API
updateAnnotazione.pending → loading = true

// 4a. Se la chiamata ha successo
updateAnnotazione.fulfilled → 
  - loading = false
  - state.items aggiornato
  - state.selectedAnnotazione aggiornato

// 4b. Se la chiamata fallisce
updateAnnotazione.rejected → 
  - loading = false
  - state.error = "Messaggio di errore"

// 5. Il componente si ri-renderizza con i nuovi dati
```

---

## Best Practices

### 1. Normalizzazione dello Stato
```javascript
// ❌ MALE: Duplicazione dei dati
{
  items: [...],
  selectedItem: { ...stessi dati... }
}

// ✅ BENE: Riferimento per ID
{
  items: [...],
  selectedItemId: 123
}
```

### 2. Gestione Errori
```javascript
// Usa sempre rejectWithValue nei thunks
catch (error) {
  return rejectWithValue(
    error.response?.data?.message || 'Errore generico'
  );
}
```

### 3. Selettori
```javascript
// Crea selettori per logica complessa
const selectModifiableAnnotazioni = (state) => {
  return state.annotazioni.items.filter(
    item => item.stato === 'INSERITA' || item.stato === 'MODIFICATA'
  );
};

// Usa nel componente
const modificabili = useSelector(selectModifiableAnnotazioni);
```

---

## Redux DevTools

Redux Toolkit abilita automaticamente DevTools per il debugging:

1. Installa l'estensione browser "Redux DevTools"
2. Apri DevTools nel browser (F12)
3. Vai alla tab "Redux"
4. Puoi vedere:
   - Stato corrente
   - Storico delle azioni
   - Diff tra stati
   - Time-travel debugging (torna indietro nel tempo!)

---

## Riepilogo

**Redux nel progetto gestisce:**
- ✅ Autenticazione (login, logout, token)
- ✅ Lista annotazioni
- ✅ Annotazione selezionata
- ✅ Transizioni di stato
- ✅ Stato di caricamento
- ✅ Gestione errori
- ✅ Prenotazioni per la modifica

**Vantaggi:**
- Stato centralizzato e prevedibile
- Facile debugging con DevTools
- Separazione tra logica e UI
- Facile testing
- Condivisione dati tra componenti

**Quando usare Redux:**
- ✅ Stato condiviso tra molti componenti
- ✅ Logica complessa di gestione dello stato
- ✅ Necessità di middleware (come API calls)
- ❌ Applicazioni molto semplici (usa useState locale)



# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by <a href="https://www.alnao.it">AlNao</a>
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.



