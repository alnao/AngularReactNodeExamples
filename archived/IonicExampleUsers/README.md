# Ionic Example Users

App Ionic 5 + Angular 12 che mostra un elenco di utenti generati da [randomuser.me](https://randomuser.me/), con pagina di dettaglio e memorizzazione locale tramite Ionic Storage.

| Scheda | |
|---|---|
| **Stack** | Ionic 5, Angular 12, TypeScript, Ionic Storage, Angular Flex Layout |
| **Node** | 14 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 (oppure `ionic serve`) |
| **Backend** | Nessuno: API pubblica di [randomuser.me](https://randomuser.me/) |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

## Struttura
- `src/app/services/user.service.ts`: chiamata a randomuser.me e uso dello storage
- `src/app/home`, `users`, `user-data`: pagine Ionic
- `src/app/dettaglio`: componente di dettaglio utente
- `resources/`: icone e splash screen per Android e iOS

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
