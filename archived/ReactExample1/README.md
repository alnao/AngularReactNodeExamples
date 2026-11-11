# React Example 1

Primo esempio React 16 con Create React App: componenti di base (saluti, contatore, cliente) e una piccola app "GestFid" per i clienti di una carta fedeltà. Il login è simulato nel browser con credenziali scritte nel codice: solo a scopo didattico.

| Scheda | |
|---|---|
| **Stack** | React 16, Create React App 3, Bootstrap, Formik, Axios, React Router |
| **Node** | 16 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:3000 |
| **Backend** | API REST esterna non inclusa su `http://localhost:5071/api/clienti` (vedi `src/components/services/clientiAPI.js`) |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

> Nota: `react-scripts` 3 usa webpack 4, che non parte con Node 17 o superiori (errore OpenSSL): usare la versione di `.nvmrc`.

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
