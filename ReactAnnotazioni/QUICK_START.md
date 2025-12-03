# ⚡ Quick Start Guide - AlNaoTazioni

## 🎯 Server Attivo

Il server di sviluppo è **ATTIVO** e raggiungibile su:

- **Local**: http://localhost:3000
- **Network**: http://192.168.1.201:3000

## 🚦 Stato Attuale

✅ Progetto creato
✅ Dipendenze installate
✅ Compilazione completata
✅ Server di sviluppo in esecuzione
✅ Tutti i componenti implementati

## 📱 Come Testare

### 1. Apri il Browser
Vai su http://localhost:3000

### 2. Login
- Inserisci username e password (configurati nel backend)
- Clicca "Accedi"

### 3. Elenco Annotazioni
- Clicca su "Elenco Annotazioni" nella navbar
- Usa la select per cercare e selezionare un'annotazione
- Clicca "Modifica" per abilitare la modifica
- Modifica i campi e la textarea
- Clicca "Salva Modifiche"

### 4. Cambio Stato
- Clicca su "Cambio Stato" nella navbar
- Seleziona uno stato dal filtro
- Usa la ricerca per filtrare ulteriormente
- Seleziona le annotazioni desiderate
- Scegli il nuovo stato
- Clicca "Cambia Stati"

### 5. Logout
- Clicca sul tuo username in alto a destra
- Seleziona "Logout"

## 🔧 Comandi Utili

```bash
# Fermare il server
Ctrl+C nel terminale

# Riavviare il server
cd frontend
npm start

# Build produzione
npm run build

# Test
npm test
```

## 🌐 Backend API

Assicurati che il backend sia attivo su:
**http://localhost:8080**

Le API utilizzate:
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/annotazioni` - Lista annotazioni
- `GET /api/annotazioni/:id` - Dettaglio
- `PUT /api/annotazioni/:id` - Aggiorna
- `PATCH /api/annotazioni/:id/stato` - Cambia stato
- `POST /api/annotazioni/:id/prenota` - Lock
- `DELETE /api/annotazioni/:id/prenota` - Unlock
- `GET /api/annotazioni/transizioni-stato` - Transizioni

## 🐛 Troubleshooting

### Backend non raggiungibile
```bash
# Verifica che il backend sia attivo
curl http://localhost:8080/api/auth/providers
```

### Errore 401
- Verificare credenziali
- Token scaduto (rifare login)

### Annotazione bloccata
- Attendere scadenza lock (120s)
- Verificare chi ha il lock

### Errore cambio stato
- Verificare che la transizione sia valida
- Controllare i permessi utente

## 📊 Struttura Dati

### Login Request
```json
{
  "username": "mario.rossi",
  "password": "password123"
}
```

### Annotazione
```json
{
  "id": "uuid",
  "versioneNota": "1.0",
  "valoreNota": "Contenuto...",
  "descrizione": "Descrizione",
  "stato": "INSERITA",
  "categoria": "Categoria",
  "tags": "tag1, tag2",
  "pubblica": false,
  "priorita": 3,
  "utenteCreazione": "user",
  "dataInserimento": "2025-12-03T...",
  "dataUltimaModifica": "2025-12-03T..."
}
```

### Cambio Stato Request
```json
{
  "vecchioStato": "INSERITA",
  "nuovoStato": "MODIFICATA",
  "utente": "mario.rossi"
}
```

## 🎨 Personalizzazioni

### Cambiare URL Backend
Editare `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

### Cambiare Durata Lock
Editare `src/pages/ElencoAnnotazioni.js`:
```javascript
secondi: 120  // Cambia a tuo piacimento
```

### Modificare Colori
Usa le variabili Bootstrap in `src/index.css` o crea un file `custom.scss`

## ✅ Checklist Pre-Deploy

- [ ] Backend attivo e raggiungibile
- [ ] Credenziali di test configurate
- [ ] Transizioni di stato configurate nel backend
- [ ] CORS abilitato per il frontend
- [ ] Variabili d'ambiente configurate
- [ ] Build di produzione testata

## 📚 Documentazione Completa

- `README.md` - Standard React
- `FRONTEND_README.md` - Guida frontend
- `PROJECT_STATUS.md` - Stato progetto
- `project-info.json` - Info struttura
- `../API.md` - Documentazione API backend

## 🎉 Tutto Pronto!

Il frontend è **completamente funzionante** e pronto all'uso!

Apri http://localhost:3000 e inizia a usare AlNaoTazioni! 🚀



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



