# React Example 2 - Lambda Client con autenticazione JWT

Variante di [ReactExample2lambdaClient](../ReactExample2lambdaClient/README.md) senza Cognito: login verso un server di autenticazione JWT, elenco paginato e inserimento clienti, route protette per ruolo.

| Scheda | |
|---|---|
| **Stack** | React 17, Create React App 4, React-Bootstrap, Formik, React Router 5 |
| **Node** | 16 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:3000 |
| **Backend** | AWS API Gateway + Lambda: URL in `src/components/GestFid/DataConstants.js` (endpoint di esempio, probabilmente non più attivi) |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

> Nota: `react-scripts` 4 usa webpack 4, che non parte con Node 17 o superiori (errore OpenSSL): usare la versione di `.nvmrc`.

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
