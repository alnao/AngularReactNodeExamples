# 📝 AlNaoTazioni - Sistema di Gestione Annotazioni

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?logo=redux)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)

Frontend per la gestione di annotazioni con autenticazione, cambio stato, filtri avanzati e interfaccia Bootstrap 5.

| Scheda | |
|---|---|
| **Stack** | React 19, TypeScript, Vite 8, Redux Toolkit, React Router 7, Bootstrap 5, Axios, Vitest |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `nvm use && npm install && npm run dev` → http://localhost:3000 |
| **Backend** | Applicazione Spring Boot [Annotazioni](https://github.com/alnao/JavaSpringBootExample), di default su `http://localhost:8082` |
| **Stato** | Attivo |
| **Ultima verifica** | Novembre 2026: build, lint, test unitari e prova end-to-end con backend simulato |

---

## 📋 Indice

- [Caratteristiche](#-caratteristiche)
- [Tecnologie](#-tecnologie)
- [Prerequisiti](#-prerequisiti)
- [Installazione e avvio](#-installazione-e-avvio)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Migrazione da Create React App](#-migrazione-da-create-react-app)
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
- ⚡ **Redux Toolkit** con hook tipizzati (`useAppDispatch`, `useAppSelector`)

---

## 🛠 Tecnologie

### Frontend
- **React 19** - Libreria UI con functional components e hooks
- **TypeScript 6** - Tipi per payload API, store e componenti (`src/types.ts`)
- **Vite 8** - Dev server e build (sostituisce Create React App)
- **Redux Toolkit 2** - State management semplificato
- **React Router 7** - Navigazione SPA
- **Bootstrap 5.3** + **Bootstrap Icons** - Framework CSS responsive e icone
- **React Select 5** - Dropdown con ricerca avanzata
- **Axios 1** - HTTP client con interceptor JWT
- **Vitest** - Test unitari dei reducer

### Backend
- Applicazione Java **Spring Boot** del repository [JavaSpringBootExample](https://github.com/alnao/JavaSpringBootExample), non inclusa in questa cartella
- Le API usate dal frontend sono descritte in [API.md](./API.md)

---

## 📦 Prerequisiti

- **Node.js 22** (`nvm use` legge il file `.nvmrc`); Vite 8 richiede almeno Node 20.19
- **npm** 10.x o superiore
- **Backend API** in esecuzione su `http://localhost:8082`, oppure su un altro URL impostato in `VITE_API_BASE_URL`

---

## 🚀 Installazione e avvio

```bash
git clone https://github.com/alnao/AngularReactNodeExamples.git
cd AngularReactNodeExamples/ReactAnnotazioni
nvm use
npm install
cp .env.example .env      # opzionale: solo per cambiare l'URL del backend
npm run dev               # oppure npm start
```

L'applicazione sarà disponibile su **http://localhost:3000** (porta fissata in `vite.config.ts`, la stessa usata prima con Create React App).

| Comando | Descrizione |
|---|---|
| `npm run dev` / `npm start` | Dev server Vite con hot reload |
| `npm run build` | Controllo dei tipi (`tsc -b`) e build di produzione in `dist/` |
| `npm run preview` | Serve localmente la build di `dist/` |
| `npm run lint` | ESLint (regole TypeScript e React Hooks) |
| `npm run typecheck` | Solo controllo dei tipi |
| `npm test` | Test unitari con Vitest |

---

## 📁 Struttura del Progetto

```
ReactAnnotazioni/
├── index.html                     # Pagina HTML di ingresso (Vite)
├── vite.config.ts                 # Config Vite (porta 3000) e Vitest
├── tsconfig*.json                 # Config TypeScript
├── eslint.config.js
├── .env.example                   # VITE_API_BASE_URL
├── public/                        # favicon, manifest, icone
├── src/
│   ├── main.tsx                   # Entry point
│   ├── App.tsx                    # Routing principale
│   ├── types.ts                   # Tipi condivisi (Annotazione, User, stati...)
│   ├── app/
│   │   ├── store.ts               # Configurazione Redux store + RootState/AppDispatch
│   │   └── hooks.ts               # useAppDispatch / useAppSelector tipizzati
│   ├── components/
│   │   ├── Navbar.tsx             # Barra di navigazione
│   │   ├── PrivateRoute.tsx       # Protezione route
│   │   └── Toast.tsx              # Notifiche toast
│   ├── pages/
│   │   ├── Login.tsx              # Pagina di login
│   │   ├── ElencoAnnotazioni.tsx  # Gestione annotazioni
│   │   └── CambioStato.tsx        # Cambio stato massivo
│   ├── services/
│   │   └── api.ts                 # Configurazione Axios e chiamate API
│   └── store/
│       ├── authSlice.ts           # Slice autenticazione (+ test)
│       └── annotazioniSlice.ts    # Slice annotazioni (+ test)
├── API.md                         # API del backend
├── REACT.md                       # Guida React del progetto
└── REDUX.md                       # Guida Redux del progetto
```

---

## 🔁 Migrazione da Create React App

Fino a dicembre 2025 il progetto usava Create React App (`react-scripts`), che è deprecato. A novembre 2026 è stato migrato a Vite + TypeScript:

- `public/index.html` → `index.html` nella radice, con `<script type="module" src="/src/main.tsx">`
- `src/index.js` → `src/main.tsx`; tutti i `.js` sono diventati `.ts`/`.tsx` con tipi espliciti
- variabili d'ambiente: `REACT_APP_*` → `VITE_*`, lette con `import.meta.env` (prima l'URL del backend era scritto nel codice)
- test: Jest di `react-scripts` → Vitest; rimossi i file del template CRA (counter, logo, `reportWebVitals`, test "learn react")
- build in `dist/` invece di `build/`
- corretto un bug: avviando la modifica con "Modifica Annotazione" il dettaglio dell'annotazione spariva, perché l'effetto di caricamento dipendeva dal timer della prenotazione (ora il timer è in un `useRef`)


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

### [REACT.md](./REACT.md)
Guida completa React con:
- Introduzione a React e componenti
- **useState**: Spiegazione dettagliata di tutti gli 8 stati
- **useEffect**: Analisi dei 2 effetti con timing e sequenze
- **Handle Functions**: Tutte le 7 funzioni con flussi completi
- Ciclo di vita del componente
- Pattern comuni e best practices

### [REDUX.md](./REDUX.md)
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
L'URL del backend si imposta con la variabile `VITE_API_BASE_URL` (file `.env`, vedi `.env.example`). Il valore viene letto in `src/services/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
```

### Token JWT
Il token viene salvato automaticamente in localStorage:
- Key: `token`
- Injected automaticamente in ogni richiesta tramite Axios interceptor

### Timeout Lock
Il tempo di prenotazione è la costante `DURATA_PRENOTAZIONE_SECONDI` in `src/pages/ElencoAnnotazioni.tsx`:

```typescript
const DURATA_PRENOTAZIONE_SECONDI = 120; // 2 minuti
```

---

## 🧪 Testing

```bash
npm test          # test unitari dei reducer con Vitest
npm run lint
npm run typecheck
```

---

## 🚀 Build per Produzione

```bash
npm run build
# I file ottimizzati saranno in: dist/
npm run preview   # per provarli in locale
```

### Deploy
I file della build possono essere serviti da:
- Nginx
- Apache
- Netlify / Vercel
- AWS S3 + CloudFront

Trattandosi di una SPA con React Router, il server deve rispondere con `index.html` anche per le route come `/annotazioni`.

---

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push del branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📝 Changelog

### v0.2.0 (2026-11)
- 🔁 Migrazione da Create React App a Vite + TypeScript
- ✅ URL del backend configurabile con `VITE_API_BASE_URL`
- ✅ Test unitari dei reducer con Vitest
- 🐛 Corretto il dettaglio che spariva avviando la modifica

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

Questo progetto è rilasciato sotto licenza GNU GPL v3, come tutto il repository. Vedi il file [LICENSE](../LICENSE).



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



