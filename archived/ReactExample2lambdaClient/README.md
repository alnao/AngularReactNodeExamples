# React Example 2 - Lambda Client

App React 17 "GestFid" per la gestione dei clienti di una carta fedeltà, con backend su AWS API Gateway + Lambda: login, registrazione con AWS Cognito (`Login/UserPool.js`), elenco paginato e inserimento clienti, route protette per ruolo.

| Scheda | |
|---|---|
| **Stack** | React 17, Create React App 4, React-Bootstrap, Formik, React Router 5, amazon-cognito-identity-js |
| **Node** | 16 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:3000 |
| **Backend** | AWS API Gateway + Lambda e Cognito: URL in `src/components/GestFid/DataConstants.js` (endpoint di esempio, probabilmente non più attivi) |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

> Nota: `react-scripts` 4 usa webpack 4, che non parte con Node 17 o superiori (errore OpenSSL): usare la versione di `.nvmrc`.

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
