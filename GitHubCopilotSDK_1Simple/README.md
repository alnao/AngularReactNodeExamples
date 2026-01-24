# GitHub Copilot SDK - Esempio 1 semplice esempio

Questo progetto mostra come utilizzare il [GitHub Copilot SDK](https://github.com/github/copilot-sdk) in un'applicazione Node.js/TypeScript per generare risposte AI tramite API.

## 🚀 Funzionalità

- Connessione al servizio Copilot tramite SDK ufficiale
- Creazione di una sessione AI specificando il modello (`gpt-5.2`)
- Invio di un prompt e ricezione della risposta generata
- Gestione asincrona e chiusura sicura della sessione

## 📦 Requisiti

- Utenza **github** 
    - servizio GitHub Copilot attivo
- Applicativo **git** e comando **gu** installato
    - login eseguita correttamente con `gu auth login`
- **Node.js** 18+ e **npm**

## ⚡ Installazione

```sh
npm install @github/copilot-sdk tsx
npm install
```

## ▶️ Esecuzione

```sh
npx tsx index.ts
```

## 📄 Esempio di codice

Vedi [index.ts](index.ts) per il codice completo:

```ts
import { CopilotClient } from "@github/copilot-sdk";

async function main() {
	const client = new CopilotClient();
	try {
		const session = await client.createSession({ model: "gpt-5.2" });
		const response = await session.sendAndWait({ prompt: "Write a python function to generate a random password of 12 characters" });
		console.log(response?.data.content);
	} finally {
		await client.stop();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
```

## 🔗 Risorse utili

- [Copilot SDK - Getting Started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)
- [Copilot SDK su npm](https://www.npmjs.com/package/@github/copilot-sdk)




# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by Made with ❤️ by [@alnao](https://github.com/alnao)
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.



