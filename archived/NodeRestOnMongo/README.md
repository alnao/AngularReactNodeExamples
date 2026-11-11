# Node REST on Mongo

Espone un'API REST generica sopra MongoDB senza scrivere codice, usando il pacchetto [rest-on-mongo](https://www.npmjs.com/package/rest-on-mongo).

| Scheda | |
|---|---|
| **Stack** | Node.js, rest-on-mongo 2, MongoDB |
| **Node** | 22 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && cp .env.example .env && ./runRestOnMongo.sh` → http://localhost:3000 |
| **Backend** | MongoDB: stringhe di connessione `SERVER_*` nel file `.env` |
| **Stato** | In revisione |
| **Ultima verifica** | Novembre 2026: `npm ci` con Node 22 (avvio non provato: serve MongoDB) |

## Configurazione
`rest-on-mongo` legge il file `.env` (con dotenv) dalla cartella da cui viene avviato. Partire da [`.env.example`](./.env.example):
- `PORT`: porta HTTP
- `PREFIXES`: elenco di prefissi separati da virgola; per ognuno vengono esposte le rotte `/<prefisso>/<collection>` e `/<prefisso>/<collection>/<id>`
- `SERVER_<prefisso>` e `DB_<prefisso>`: server MongoDB e database usati da quel prefisso
- `AUTH_TOKEN` (facoltativo): se presente, le richieste devono includere questo token

Il file `.env` contiene credenziali e non va committato.

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
