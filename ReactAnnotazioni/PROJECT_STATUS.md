# 🚀 Progetto Completato - AlNaoTazioni Frontend

> ⚠️ **Documento storico** (dicembre 2025, versione Create React App). Percorsi `.js`, porte e comandi qui sotto possono non essere più validi: il progetto ora usa Vite + TypeScript. Per installazione e avvio vedi il [README](./README.md).

## ✅ Stato del Progetto

Il frontend React con Redux e Bootstrap 5 è stato creato con successo!

## 📁 Struttura Creata

```
ReactAnnotazioni/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js           # Barra navigazione con logo e dropdown utente
    │   │   └── PrivateRoute.js     # Protezione route
    │   ├── pages/
    │   │   ├── Login.js            # Pagina login
    │   │   ├── ElencoAnnotazioni.js # Gestione annotazioni con select
    │   │   └── CambioStato.js      # Cambio stato massivo
    │   ├── services/
    │   │   └── api.js              # Client API Axios
    │   ├── store/
    │   │   ├── authSlice.js        # Redux auth
    │   │   └── annotazioniSlice.js # Redux annotazioni
    │   ├── app/
    │   │   └── store.js            # Configurazione Redux
    │   ├── App.js                  # Routing principale
    │   ├── index.js                # Entry point
    │   └── index.css               # Stili globali
    ├── package.json
    ├── README.md
    ├── FRONTEND_README.md
    └── .env.example
```

## 🎨 Caratteristiche Implementate

### ✓ Navbar (Barra orizzontale)
- Logo "AlNaoTazioni" con icona
- Link "Elenco Annotazioni"
- Link "Cambio Stato"
- Dropdown utente a destra con:
  - Username
  - Email
  - Ruolo
  - Bottone Logout

### ✓ Pagina Login
- Form elegante con icone
- Validazione
- Gestione errori
- Redirect automatico dopo login

### ✓ Elenco Annotazioni
- **Select avanzato** con ricerca (react-select)
- Visualizzazione completa dettagli annotazione
- **Textarea fullwidth** per il valore della nota
- Sistema di modifica con lock temporaneo (120 secondi)
- **Bottone Salva sopra e sotto** la textarea
- Contatore caratteri (max 10000)
- Campi:
  - ID (readonly)
  - Versione (readonly)
  - Descrizione
  - Categoria
  - Tags
  - Priorità (select 1-5)
  - Pubblica (switch)
  - Utente creazione (readonly)
  - Date (readonly)
  - Valore nota (textarea)

### ✓ Cambio Stato
- **Filtro per stato** (select)
- **Filtro ricerca** full-text
- Counter risultati
- Tabella annotazioni con:
  - Checkbox per selezione multipla
  - Descrizione
  - Stato (badge colorato)
  - Categoria
  - Utente
  - Priorità
  - Date
- **Card cambio stato massivo**:
  - Visualizzazione stato attuale → nuovo stato
  - Select con transizioni valide
  - Bottone "Cambia Stati"
  - Report risultati (successi/errori)
- Info transizioni disponibili

## 🎯 Tecnologie Utilizzate

- ⚛️ React 19.2.0
- 🔄 Redux Toolkit
- 🧭 React Router v7
- 🎨 Bootstrap 5
- 🔍 React Select
- 📡 Axios
- 🎭 Bootstrap Icons

## 🚀 Come Avviare

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

L'applicazione sarà disponibile su: **http://localhost:3000**

## 🔌 Connessione Backend

L'applicazione si connette a: **http://localhost:8080**

Per modificare l'URL, editare `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080';
```

## 📊 Stati Annotazione

Il sistema gestisce 9 stati:
- 🆕 INSERITA
- ✏️ MODIFICATA
- ✅ CONFERMATA
- ❌ RIFIUTATA
- 📤 DAINVIARE
- 📨 INVIATA
- ⏰ SCADUTA
- 🚫 BANNATA
- ⚠️ ERRORE

## 🔐 Autenticazione

- Token JWT salvato in localStorage
- Auto-inject in ogni richiesta API
- Auto-logout su errori 401
- Protezione route private

## 🎨 UI/UX Features

✓ Design responsive Bootstrap 5
✓ Icone Bootstrap Icons
✓ Loading spinners
✓ Alert e toast per feedback
✓ Badge colorati per stati
✓ Form validation
✓ Select con ricerca
✓ Tooltip e hover effects
✓ Tabelle responsive
✓ Card moderne con shadow

## 📝 Flusso Utente

1. **Login** → Inserire credenziali
2. **Elenco** → Selezionare annotazione dalla select
3. **Dettaglio** → Visualizzare tutti i campi
4. **Modifica** → Cliccare "Modifica", modificare, salvare
5. **Cambio Stato** → Filtrare, selezionare, cambiare stati

## 🔒 Sistema Lock

- Lock di 120 secondi per modifiche
- Prenotazione automatica al click "Modifica"
- Rilascio automatico dopo salvataggio
- Rilascio manuale con "Annulla"
- Timer di scadenza visibile

## ⚙️ Build Produzione

```bash
npm run build
```

Output in `build/` pronto per deploy.

## 🎯 Prossimi Passi Consigliati

1. Configurare il backend su http://localhost:8080
2. Testare il login con credenziali valide
3. Esplorare le funzionalità
4. Personalizzare colori in Bootstrap (se necessario)
5. Aggiungere eventuali funzionalità extra

## 📖 Documentazione

- `README.md` - Documentazione React standard
- `FRONTEND_README.md` - Guida dettagliata frontend
- `../API.md` - Documentazione API backend

## ✨ Note Finali

Il progetto è **completo e funzionante**! 

Tutte le specifiche richieste sono state implementate:
✓ Navbar con logo e link
✓ Dropdown utente
✓ Pagina login
✓ Select con ricerca
✓ Textarea fullwidth
✓ Bottoni salva sopra e sotto
✓ Filtri stato e ricerca
✓ Cambio stato massivo A→B
✓ Grafica Bootstrap 5
✓ Redux per state management

---

**Buon lavoro con AlNaoTazioni! 🎉**



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



