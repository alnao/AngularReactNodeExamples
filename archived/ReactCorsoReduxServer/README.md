# React Corso Redux Server

Piccolo server Express usato come backend negli esempi del corso Redux: espone un elenco di attrazioni (luoghi di Torino) con immagini statiche in `public/`.

| Scheda | |
|---|---|
| **Stack** | Node.js, Express 4, cors, body-parser |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && node server.js` → http://localhost:5002 |
| **Backend** | Nessuno: dati in memoria (`attractions.js`) |
| **Stato** | In revisione |
| **Ultima verifica** | Novembre 2026: `npm ci` e `GET /attractions` con Node 22 |

## API
Tutte le chiamate tranne `/` richiedono l'header `Authorization`. Il valore è libero e identifica la propria copia dei dati: ogni token parte dall'elenco iniziale e vede solo le proprie modifiche.

| Metodo | Percorso | Descrizione |
|---|---|---|
| GET | `/` | Guida alle API |
| GET | `/attractions` | Elenco delle attrazioni |
| POST | `/attractions` | Aggiunge un'attrazione (`name` e `type` obbligatori) |
| DELETE | `/attractions/:id` | Elimina un'attrazione |

Porta e origine si cambiano con le variabili d'ambiente `PORT` e `ORIGIN` (vedi `config.js`).

```bash
curl -H 'Authorization: prova' http://localhost:5002/attractions
```

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
