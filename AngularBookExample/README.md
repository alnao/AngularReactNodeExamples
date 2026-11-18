# Angular BookExample

| Scheda | |
|---|---|
| **Stack** | Angular 9, TypeScript, Bootstrap; backend opzionale PHP + MySQL |
| **Node** | 12 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`); funziona anche con Node 22 grazie a [`scripts/ng.js`](./scripts/ng.js) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 |
| **Backend** | A scelta: json-server (`server-json-mock`), PHP + MySQL (`server-php`), [AwsLambdaBooks](../AwsLambdaBooks/README.md), [AzureFunctionBooks](../AzureFunctionBooks/README.md) |
| **Stato** | Attivo |
| **Ultima verifica** | Novembre 2026: typecheck, `npm run build` (anche `--configuration=aws`) e `npm start` con Node 22; Node 12 non verificato |

Questo **BookExample** è una semplice applicazione Angular 9 (datato 2022) per la gestione di una libreria di libri, con backend selezionabile tra:
- Server mock con un semplice file JSON
- Server PHP con database MySQL.
- API esposte da servizi serverless nel cloud AWS
- API esposte da servizi serverless nel cloud Azure

Il progetto mostra come integrare frontend moderno, API REST e backend multipli in modo flessibile.
- 🖥️ Demo UI
    - Ricerca e filtro in tempo reale
    - Card e lista libri con badge prezzo, autore, azioni rapide
    - Form di inserimento/modifica integrato nella UI
Il frontend si esegue con il comando

## ⚙️ Come eseguire il progetto
Per eseguire il progetto lanciare 
```
npm install
npm start
```
Gli script `start`, `start:aws`, `build` e `test` passano da [`scripts/ng.js`](./scripts/ng.js), che avvia la Angular CLI. Angular 9 usa webpack 4, che con Node 17 o superiori fallisce con l'errore `ERR_OSSL_EVP_UNSUPPORTED` (`error:0308010C:digital envelope routines::unsupported`): con quelle versioni lo script aggiunge da solo `NODE_OPTIONS=--openssl-legacy-provider`. Con Node 12, la versione di `.nvmrc`, non aggiunge nulla. Lanciando `ng serve` direttamente, senza lo script, con Node 22 l'errore si ripresenta.
- il sito poi sarà disponibile al `http://localhost:4200/`

Ma **prima** bisogna configurare il backend di riferimento nel file `src/environments/environment.ts`.
- nota: andrebbe fatto un `.env` nel progetto web ma per ora lasciato solo il file typescript

## ☁️ Selezione del backend
- **Json statico**
    ```sh
    npx json-server --watch server-json-mock/server.json
    ```
    - Le API saranno disponibili su `http://localhost:3000/books`.
- **AWS Lambda** (`tipoApi: "AWS"`, il valore predefinito)
    - Backend nella cartella [`AwsLambdaBooks`](../AwsLambdaBooks/README.md), che si può avviare in locale (porta 3001, DynamoDB Local in Docker) oppure deployare su AWS con SAM.
    - In locale basta `npm start`: `environment.ts` punta già a `http://localhost:3001/books`.
    - Con lo stack su AWS: copiare `src/environments/environment.aws.example.ts` in `src/environments/environment.aws.ts` (ignorato da git), inserire URL e API key, poi avviare con `npm run start:aws`. Il servizio aggiunge l'header `x-api-key` a ogni chiamata.
    - Passi completi e checklist: sezione [Test completo con il frontend](../AwsLambdaBooks/README.md#test-completo-con-il-frontend).
- **Azure Functions** (`tipoApi: "Azure"`)
    - Backend nella cartella [`AzureFunctionBooks`](../AzureFunctionBooks/README.md), che si può avviare in locale (`func start` sulla porta 7071, emulatore Cosmos DB in Docker) oppure pubblicare su Azure con `start-all.sh`.
    - In locale basta impostare `tipoApi: "Azure"` in `environment.ts`, che punta già a `http://localhost:7071/api/books`.
    - Con le risorse su Azure: copiare `src/environments/environment.azure.example.ts` in `src/environments/environment.azure.ts` (ignorato da git), inserire URL e chiave, poi avviare con `npm run start:azure`. Il servizio aggiunge l'header `x-functions-key` a ogni chiamata.
    - Passi completi e checklist: sezione [Test completo con il frontend](../AzureFunctionBooks/README.md#test-completo-con-il-frontend).
- **Mysql on docker**

    - Se si è scelto la versione con il mysql server, per lanciare il backend, eseguire i passi
        - Identificare il server Mysql, oppure lanciare un server tramite docker con il comando
            ```bash
            docker run --name mysql4242 -e MYSQL_ROOT_PASSWORD=xxxx -e MYSQL_DATABASE=bookexample -p 4242:3306 -d mysql:8 mysqld 
            ```
            - comandi utili per il docker
                ```sh
                # Eseguire sql dentro al server, per esempio creare un utente nel caso root non funzionasse
                docker exec -it mysql4242 mysql -u"root" -p"xxxx" -e "
                    CREATE USER 'bookuser'@'%' IDENTIFIED BY 'bookpass';
                    GRANT ALL PRIVILEGES ON *.* TO 'bookuser'@'%';
                    FLUSH PRIVILEGES;
                "
                # Eseguire un comando dentro immagine
                docker exec -it mysql4242 bash
                # Visualizzare i log della immagine
                docker logs -f mysql4242
                # Eliminare la immagine
                docker rm -f mysql4242
                ```
            - nota: negli script php è stata disattivata la verifica del certificato per funzionare anche su docker semplici o serverr locali `PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false`
        - Creare il file `./server-php/.env` partendo da [`server-php/.env.example`](./server-php/.env.example) (il file `.env` non va committato)
            ```
            DB_HOST=127.0.0.1
            DB_NAME=bookexample
            DB_PORT=4242
            DB_USER=root
            DB_PASS=xxxx
            JWT_SECRET=<almeno 32 caratteri casuali>
            ```
            - il segreto si può generare con `php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'`
            - nota: con `DB_HOST=localhost` il driver MySQL di PHP prova il socket locale; con docker usare `127.0.0.1`
        - Creare il dabatase se mai creato
            ```
            php ./server-php/create.php
            ```
        - Avviare il server
            ```
            php -S localhost:8000 -t server-php
            ```
            - API libri: [http://localhost:8000/api.php](http://localhost:8000/api.php)
            - Autenticazione: [http://localhost:8000/auth/index.php](http://localhost:8000/auth/index.php) (vedi sotto)
            - Test: [http://localhost:8000/test.php](http://localhost:8000/test.php)
        - **Autenticazione JWT** (`auth/index.php`): esempio didattico di login, non ancora usato dal frontend Angular
            ```bash
            curl -X POST -H 'Content-Type: application/json' \
                 -d '{"username":"demo","password":"demo"}' http://localhost:8000/auth/index.php
            # {"token":"eyJ...","scadenza":30000}
            ```
            - le password sono salvate solo come hash (`password_hash` / `password_verify`)
            - il payload del JWT contiene solo `sub`, `iat` ed `exp`: è leggibile da chiunque, quindi non contiene mai la password
            - il token è firmato con `JWT_SECRET` letto dal `.env` e non viene salvato nel database
            - l'utente `demo`/`demo` creato da `create.php` serve solo per lo sviluppo locale
            - se la tabella `user` era stata creata con la versione precedente (password in chiaro), rieseguire `php ./server-php/create.php`: allarga la colonna e salva l'hash della password di `demo`. Eventuali altri utenti con password in chiaro vanno ricreati.

        - Se usato Apache, è possibile rinominare htaccess.txt in .htaccess per applicare le regole sugli header.

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-03-11 | Test esempi books: aggiornati environment, `angular.json`, dipendenze |
| 2026-11-11 | Revisione server PHP e configurazione `.env`; aggiunti `.nvmrc`, scheda |
| 2026-11-18 | Backend AWS: header `x-api-key`, configurazione `aws`, id stringa |
| 2026-11-18 | Script `ng.js`: avvio anche con Node 22 (OpenSSL legacy) |
| 2026-11-18 | Backend Azure: `tipoApi` Azure, header `x-functions-key`, configurazione `azure` |


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

