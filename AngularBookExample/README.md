# Angular BookExample
Questo **BookExample** è una semplice applicazione Angular 9 (datato 2022) per la gestione di una libreria di libri, con backend selezionabile tra mock JSON server e PHP/MySQL. Il progetto mostra come integrare frontend moderno, API REST e backend multipli in modo flessibile.

- 🖥️ Demo UI
    - Ricerca e filtro in tempo reale
    - Card e lista libri con badge prezzo, autore, azioni rapide
    - Form di inserimento/modifica integrato nella UI
- ⚙️ Come eseguire il progetto
    - Scegliere se eseguire con la versione json oppure php, modificare di conseguenza il file `environemnts.ts` 
        - nota: andrebbe fatto un `.env` nel progetto web ma per ora lasciato solo il file typescript
    - Eseguire il frotend con il comando
        ```
        npm install
        ng serve
        ```
        che sarà disponibile al `http://localhost:4200/`
    - Se si è scelto la versione con il **json server**, per lanciare il backend, eseguire il comando
        ```sh
        npx jsonserver --path server-json-mock/server.json
        ```
        - Le API saranno disponibili su `http://localhost:3000/books`.
    - Se si è scelto la versione con il mysql server, per lanciare il backend, eseguire i passi
        - Identificare il server Mysql, oppure lanciare un server tramite docker con il comando
            ```
            docker run --name mysql4242 -e MYSQL_ROOT_PASSWORD=xxxx -e MYSQL_DATABASE=bookexample -p 4242:3306 -d mysql:8 mysqld 
            ```
            - comandi utili per il docker
                ```sh
                # Eseguire sql dentro al server, per esempio creare un utente nel caso root non funzionasse
                docker exec -it mysql4242 mysql -uroot -pxxxx -e "
                    CREATE USER 'bookuser'@'%' IDENTIFIED BY 'bookpass';
                    GRANT ALL PRIVILEGES ON *.* TO 'bookuser'@'%';
                    FLUSH PRIVILEGES;
                "
                # Eseguire un comando dentro immagine
                docker exec -it mysql4242 bash
                # Visualizzre i log della immagine
                docker logs -f mysql4242
                # Eliminare la immagine
                docker rm -f mysql4242
                ```
            - nota: negli script php è stata disattivata la verifica del certificato per funzionare anche su docker semplici o serverr locali `PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false`
        - Creare il file ./server-php/.env con le variabili necessarie
            ```
            DB_HOST=localhost
            DB_NAME=bookexample
            DB_PORT=4242
            DB_USER=root
            DB_PASS=xxxx
            ```
        - Creare il dabatase se mai creato
            ```
            php ./server-php/create.php
            ```
        - Avviare il server
            ```
            php -S localhost:3000 -t server-php
            ```
            - API libri: [http://localhost:8000/api.php](http://localhost:8000/api.php)
            - Autenticazione: [http://localhost:8000/auth/index.php](http://localhost:8000/auth/index.php)
            - Test: [http://localhost:8000/test.php](http://localhost:8000/test.php)

        - Se usato Apache, è possibile rinominare htaccess.txt in .htaccess per applicare le regole sugli header.



# Original README by Angular CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run `npx jsonserver --path jsonserver/server.json` to execute local server with book list

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).





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

