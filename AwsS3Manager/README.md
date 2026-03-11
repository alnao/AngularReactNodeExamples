# AWSS3Manager

Gestione semplice di bucket e oggetti S3 con Node.js ed Express

## Funzionalità principali
- Elenco di tutti i bucket S3 disponibili
- Visualizzazione oggetti di un bucket
- Upload di file (base64)
- Download oggetto
- Cancellazione oggetto
- Interfaccia web minimale su Express
- Esempio di utilizzo AWS SDK v3

## Come usare

1. Installa le dipendenze:
   ```bash
   npm install
   ```
2. Avvia il server:
   ```bash
   node manager.js
   ```
3. Endpoints disponibili:
   - [http://localhost:8081/](http://localhost:8081/) → Pagina di benvenuto
   - [http://localhost:8081/bucket](http://localhost:8081/bucket) → Elenco bucket S3
   - `GET /bucket/:bucketName/objects` → Elenco oggetti di un bucket
   - `GET /bucket/:bucketName/object/:key` → Download oggetto
   - `POST /bucket/:bucketName/upload` → Upload oggetto (body: `{ key, content, encoding }`)
   - `DELETE /bucket/:bucketName/object/:key` → Cancella oggetto

## Esempio di upload (curl)
```bash
curl -X POST http://localhost:8081/bucket/NOME_BUCKET/upload \
  -H "Content-Type: application/json" \
  -d '{
    "key": "test.txt",
    "content": "dGVzdCBjb250ZW50",  # base64 di "test content"
    "encoding": "base64"
  }'
```

## Estensioni possibili
- Ricerca per nome
- Cancellazione bucket
- Download multiplo



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



