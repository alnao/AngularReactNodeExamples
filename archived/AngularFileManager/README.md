# AngularFileManager

Piccolo tool Angular 14 che legge un file CSV scelto dall'utente e ne mostra i record in una tabella, tutto nel browser. Contiene anche una prova di `inject()` usato fuori dal costruttore, novità di Angular 14.

| Scheda | |
|---|---|
| **Stack** | Angular 14, TypeScript, Bootstrap 5 |
| **Node** | 16 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 |
| **Backend** | Nessuno: il file viene letto nel browser |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

## Struttura
- `src/app/app.component.ts`: lettura del CSV (`uploadListener`), validazione dell'estensione e reset
- `src/app/app.component.html`: scelta del file e tabella dei record

---
Parte della raccolta [AngularReactNodeExamples](../README.md) di [AlNao](https://www.alnao.it) · Licenza [GPL v3](../LICENSE)
