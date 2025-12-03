# 📝 AlNaoTazioni - Sistema di Gestione Annotazioni

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.5.0-764ABC?logo=redux)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)

Sistema completo per la gestione di annotazioni con autenticazione, cambio stato, filtri avanzati e interfaccia moderna con Bootstrap 5.

---

## 📋 Indice

- [Caratteristiche](#-caratteristiche)
- [Tecnologie](#-tecnologie)
- [Prerequisiti](#-prerequisiti)
- [Installazione](#-installazione)
- [Avvio del Progetto](#-avvio-del-progetto)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Funzionalità](#-funzionalità)
- [API Backend](#-api-backend)
- [Redux Store](#-redux-store)
- [Componenti Principali](#-componenti-principali)
- [Guide Dettagliate](#-guide-dettagliate)
- [Screenshots](#-screenshots)
- [Licenza](#-licenza)

---

## ✨ Caratteristiche

- 🔐 **Autenticazione JWT** con gestione token e persistenza sessione
- 📝 **CRUD Completo** per annotazioni con validazione
- 🔄 **Gestione Stati** con transizioni configurabili
- 🔍 **Filtri Avanzati** per stato, ricerca testuale
- 🔒 **Sistema di Lock** per prevenire modifiche concorrenti (120 secondi)
- 🎨 **UI Moderna** con Bootstrap 5 e colori pastello
- 📱 **Responsive Design** ottimizzato per mobile e desktop
- 🔔 **Notifiche Toast** eleganti al posto degli alert
- 🎯 **React Select** con ricerca per selezione rapida annotazioni
- ⚡ **Redux Toolkit** per gestione stato globale ottimizzata

---

## 🛠 Tecnologie

### Frontend
- **React 19.2.0** - Libreria UI con functional components e hooks
- **Redux Toolkit 2.5.0** - State management semplificato
- **React Router 7.10.0** - Navigazione SPA
- **Bootstrap 5.3.8** - Framework CSS responsive
- **React Select 5.10.2** - Dropdown con ricerca avanzata
- **Axios 1.13.2** - HTTP client con interceptor JWT
- **Bootstrap Icons** - Set di icone moderno

### Backend
- **Node.js / Express.js** - Server API RESTful
- **Database** - (Configurabile: MySQL, PostgreSQL, MongoDB)
- **JWT** - Autenticazione token-based

---

## 📦 Prerequisiti

- **Node.js** 18.x o superiore
- **npm** 9.x o superiore
- **Backend API** in esecuzione su `http://localhost:8082`

---

## 🚀 Installazione

### 1. Clona il Repository

```bash
git clone https://github.com/alnao/AngularReactNodeExamples.git
cd AngularReactNodeExamples/ReactAnnotazioni
```

### 2. Installa le Dipendenze

#### Frontend
```bash
cd frontend
npm install
```

#### Backend (se necessario)
```bash
cd backend
npm install
```

---

## ▶️ Avvio del Progetto

### Frontend
```bash
cd frontend
npm start
```

L'applicazione sarà disponibile su: **http://localhost:3000**

### Backend
```bash
cd backend
npm start
```

L'API sarà disponibile su: **http://localhost:8082**

---

## 📁 Struttura del Progetto

```
ReactAnnotazioni/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── logo-alnaotazioni.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Barra di navigazione
│   │   │   └── Toast.js           # Notifiche toast
│   │   ├── pages/
│   │   │   ├── Login.js           # Pagina di login
│   │   │   ├── ElencoAnnotazioni.js  # Gestione annotazioni
│   │   │   └── CambioStato.js     # Cambio stato massivo
│   │   ├── services/
│   │   │   └── api.js             # Configurazione Axios
│   │   ├── store/
│   │   │   ├── index.js           # Configurazione Redux store
│   │   │   ├── authSlice.js       # Slice autenticazione
│   │   │   └── annotazioniSlice.js # Slice annotazioni
│   │   ├── App.js                 # Componente root
│   │   ├── index.js               # Entry point
│   │   └── index.css              # Stili globali
│   ├── REACT.md                   # Guida React completa
│   ├── REDUX.md                   # Guida Redux completa
│   ├── package.json
│   └── README.md
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── middlewares/
    └── package.json
```

---

## 🎯 Funzionalità

### 1. Autenticazione
- Login con username e password
- Token JWT salvato in localStorage
- Logout con pulizia sessione
- Protezione route con redirect

### 2. Elenco Annotazioni
- **Visualizzazione**: Lista completa annotazioni con select searchable
- **Filtro per Stato**: Dropdown per filtrare annotazioni (default: INSERITA)
- **Creazione**: Form per nuove annotazioni (stato automatico: INSERITA)
- **Modifica**: Modifica annotazioni in stato INSERITA o MODIFICATA
- **Lock System**: Prenotazione esclusiva per 2 minuti
- **Auto-save**: Cambio automatico stato in MODIFICATA al salvataggio
- **Validazione**: Campi obbligatori e limiti caratteri

### 3. Cambio Stato
- **Vista Tabellare**: Elenco annotazioni con dettagli
- **Filtri**: Per stato e ricerca testuale
- **Transizioni**: Bottoni azione per stati permessi
- **Regole**: Solo transizioni valide mostrate per ogni annotazione
- **Feedback**: Toast di successo/errore per ogni operazione

### 4. Stati Disponibili
- **INSERITA** ✅ - Annotazione appena creata (modificabile)
- **MODIFICATA** ⚠️ - Annotazione modificata (modificabile)
- **CONFERMATA** ✅ - Confermata e validata
- **RIFIUTATA** ❌ - Rifiutata
- **DAINVIARE** 📤 - In attesa di invio
- **INVIATA** 📨 - Inviata con successo
- **SCADUTA** ⏰ - Scaduta per timeout
- **BANNATA** 🚫 - Bannata dal sistema
- **ERRORE** ⚠️ - In stato di errore

### 5. Campi Annotazione
- **Descrizione** (max 500 caratteri) - Obbligatorio
- **Categoria** (max 100 caratteri)
- **Tags** (max 500 caratteri)
- **Priorità** (1-5, default: 1)
- **Pubblica** (boolean, default: false)
- **Valore Nota** (max 10000 caratteri) - Obbligatorio, monospace
- **Metadati**: ID, Versione, Utente Creazione, Date inserimento/modifica

---

## 🔌 API Backend

### Autenticazione
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "password"
}
```

### Annotazioni
```http
GET    /api/annotazioni                    # Lista tutte
GET    /api/annotazioni/:id                # Dettaglio
POST   /api/annotazioni                    # Crea
PUT    /api/annotazioni/:id                # Aggiorna
DELETE /api/annotazioni/:id                # Elimina
```

### Gestione Stato
```http
POST /api/annotazioni/:id/stato
Content-Type: application/json

{
  "vecchioStato": "INSERITA",
  "nuovoStato": "MODIFICATA",
  "utente": "username"
}

GET /api/annotazioni/transizioni-stato     # Transizioni valide
```

### Sistema Lock
```http
POST   /api/annotazioni/:id/prenotazione   # Prenota (120s)
DELETE /api/annotazioni/:id/prenotazione   # Rilascia
```

---

## 🗄 Redux Store

### Struttura Store

```javascript
{
  auth: {
    user: { username, ... },
    token: "jwt.token.here",
    loading: false,
    error: null
  },
  annotazioni: {
    items: [...],
    selectedAnnotazione: {...},
    transizioni: [...],
    loading: false,
    error: null,
    prenotazioni: {}
  }
}
```

### Thunks Disponibili

#### Auth Slice
- `login({ username, password })` - Login utente
- `logout()` - Logout con cleanup

#### Annotazioni Slice
- `fetchAnnotazioni()` - Carica tutte le annotazioni
- `fetchAnnotazioneById(id)` - Carica dettaglio annotazione
- `createAnnotazione(data)` - Crea nuova annotazione
- `updateAnnotazione({ id, data })` - Aggiorna annotazione
- `cambiaStato({ id, vecchioStato, nuovoStato, utente })` - Cambia stato
- `prenotaAnnotazione({ id, utente, secondi })` - Prenota per modifica
- `rilasciaPrenotazione({ id, utente })` - Rilascia prenotazione
- `fetchTransizioniStato()` - Carica transizioni disponibili

---

## 🧩 Componenti Principali

### Navbar
Barra di navigazione superiore con:
- Logo "AlNaoTazioni"
- Link pagine (Elenco Annotazioni, Cambio Stato)
- Dropdown utente con logout

### Toast
Notifica modale che sostituisce gli alert:
- Auto-chiusura dopo 3 secondi
- Bottone chiusura manuale
- 4 tipi: success, error, warning, info
- Colori e icone differenziati

### Login
Pagina di autenticazione:
- Form username/password
- Validazione
- Gestione errori
- Redirect dopo login

### ElencoAnnotazioni
Pagina principale per gestione annotazioni:
- **Select searchable** con react-select
- **Filtro per stato** con dropdown
- **Form completo** per visualizzazione/modifica
- **Validazione** campi obbligatori
- **Lock system** con timer visibile
- **Bottoni condizionali** basati su stato e permessi
- **Colori pastello** per card section

### CambioStato
Pagina per cambio stato massivo:
- **Filtri** per stato e ricerca
- **Tabella** annotazioni con dettagli
- **Bottoni azione** per ogni transizione valida
- **Sezione transizioni** disponibili visualizzata
- **Toast feedback** per ogni operazione

---

## 📚 Guide Dettagliate

Il progetto include guide complete per comprendere l'architettura:

### [REACT.md](frontend/REACT.md)
Guida completa React con:
- Introduzione a React e componenti
- **useState**: Spiegazione dettagliata di tutti gli 8 stati
- **useEffect**: Analisi dei 2 effetti con timing e sequenze
- **Handle Functions**: Tutte le 7 funzioni con flussi completi
- Ciclo di vita del componente
- Pattern comuni e best practices

### [REDUX.md](frontend/REDUX.md)
Guida completa Redux con:
- Concetti base Redux (Store, Actions, Reducers)
- Redux Toolkit e createSlice
- Thunks e gestione chiamate asincrone
- Auth Slice con login/logout
- Annotazioni Slice con tutti i thunks
- Utilizzo nei componenti
- Redux DevTools

---

## 📸 Screenshots

### Login
```
┌─────────────────────────────────────────┐
│  AlNaoTazioni                          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Username: [____________]         │ │
│  │  Password: [____________]         │ │
│  │                                   │ │
│  │  [     Login     ]                │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Elenco Annotazioni
```
┌─────────────────────────────────────────────────────────┐
│ AlNaoTazioni | Elenco | Cambio Stato     User ▼       │
├─────────────────────────────────────────────────────────┤
│  Elenco Annotazioni          [+ Nuova Annotazione]     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Filtra per Stato: [INSERITA ▼]    [Info Badge] │   │
│  │ Seleziona: [Cerca annotazioni...]              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Dettaglio Annotazione     [Salva] [INSERITA]   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Descrizione: [____________________________]     │   │
│  │ Categoria:   [_______]  Tags: [__________]      │   │
│  │ Priorità:    [3 - Media ▼]  Pubblica: [☑ Sì]   │   │
│  │                                                 │   │
│  │ Valore Nota:                                    │   │
│  │ ┌─────────────────────────────────────────┐     │   │
│  │ │                                         │     │   │
│  │ │  Testo annotazione...                   │     │   │
│  │ │                                         │     │   │
│  │ └─────────────────────────────────────────┘     │   │
│  │                                                 │   │
│  │ [          Salva Modifiche          ]          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Cambio Stato
```
┌─────────────────────────────────────────────────────────────┐
│ Cambio Stato Annotazioni                                    │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ Filtri                                              │     │
│ │ Stato: [INSERITA ▼] Cerca: [...] Risultati: 5     │     │
│ └─────────────────────────────────────────────────────┘     │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ Descrizione    Stato     Categoria  Priorità  Azioni│     │
│ ├─────────────────────────────────────────────────────┤     │
│ │ Nota 1...     INSERITA   Test       3    [→MOD][→C]│     │
│ │ Nota 2...     INSERITA   Doc        5    [→MOD][→C]│     │
│ │ Nota 3...     INSERITA   Bug        1    [→MOD][→C]│     │
│ └─────────────────────────────────────────────────────┘     │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ Transizioni di Stato Disponibili                    │     │
│ │ INSERITA → MODIFICATA | CONFERMATA | RIFIUTATA     │     │
│ │ MODIFICATA → CONFERMATA | RIFIUTATA                │     │
│ └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Personalizzazione

### Colori Pastello
I colori possono essere personalizzati modificando gli style inline:

```javascript
// Azzurro pastello per "Seleziona annotazione"
backgroundColor: '#E8F4F8'

// Giallo pastello per "Dettaglio annotazione"
backgroundColor: '#FFF9E6'

// Verde pastello per transizioni
backgroundColor: '#E6F9F0'

// Viola pastello per tabelle
backgroundColor: '#F0E6FF'
```

### Badge Stati
Colori badge personalizzabili nella funzione `getBadgeColor()`:

```javascript
const getBadgeColor = (stato) => {
  switch (stato) {
    case 'CONFERMATA': return 'success';   // Verde
    case 'RIFIUTATA': return 'danger';     // Rosso
    case 'INSERITA': return 'info';        // Azzurro
    case 'MODIFICATA': return 'warning';   // Giallo
    // ...
  }
};
```

---

## 🔧 Configurazione

### API Base URL
Modifica in `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
```

### Token JWT
Il token viene salvato automaticamente in localStorage:
- Key: `token`
- Injected automaticamente in ogni richiesta tramite Axios interceptor

### Timeout Lock
Modifica tempo prenotazione in `ElencoAnnotazioni.js`:

```javascript
secondi: 120  // 120 secondi = 2 minuti
```

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

---

## 🚀 Build per Produzione

```bash
# Frontend
cd frontend
npm run build

# I file ottimizzati saranno in: frontend/build/
```

### Deploy
I file della build possono essere serviti da:
- Nginx
- Apache
- Server Node.js con serve
- Netlify / Vercel
- AWS S3 + CloudFront

---

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push del branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📝 Changelog

### v1.0.0 (2025-12-03)
- ✅ Sistema autenticazione JWT completo
- ✅ CRUD annotazioni con validazione
- ✅ Sistema lock per modifica esclusiva
- ✅ Cambio stato con transizioni configurabili
- ✅ Filtri avanzati per stato e ricerca
- ✅ Toast notifications moderne
- ✅ UI con Bootstrap 5 e colori pastello
- ✅ Redux Toolkit per state management
- ✅ React Select per dropdown avanzati
- ✅ Guide complete React e Redux
- ✅ README completo con documentazione

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file [LICENSE](../LICENSE) per maggiori dettagli.



# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by [@alnao](https://github.com/alnao)
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.



