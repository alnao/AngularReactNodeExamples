# Angular South African Mobile Numbers

Frontend Angular 11 per caricare un file di numeri di telefono sudafricani e inviarlo a un'API Java Spring Boot che li valida e li salva su MongoDB. Le istruzioni originali (database, API, web) sono qui sotto.

| Scheda | |
|---|---|
| **Stack** | Angular 11, TypeScript |
| **Node** | 12 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm start` → http://localhost:4200 |
| **Backend** | API Java Spring Boot ([South_African_Mobile_Numbers_API](https://gitlab.com/alnao/South_African_Mobile_Numbers_API)) su `http://localhost:5071` + MongoDB |
| **Stato** | In revisione |
| **Ultima verifica** | Non verificato di recente (progetto in revisione) |

## Note originali

Database mongo 
- local must be on 27017 port
- collection collectionSouthAfricanMobileNumbers
- user "SouthAfricanMobileNumbers" password "Interlogica"
- to create
	mongo -u <USER> --authenticationDatabase admin -p --port 27017
	>	use collectionSouthAfricanMobileNumbers;
	>	db.createUser({user:"SouthAfricanMobileNumbers"
			,pwd:"Interlogica"
			,roles:[{ role:"readWrite",db:"collectionSouthAfricanMobileNumbers" }] 
		});

	>	db.grantRolesToUser("SouthAfricanMobileNumbers",[{ role: "readWrite", db: "collectionSouthAfricanMobileNumbers" }])
	mongo -u SouthAfricanMobileNumbers --authenticationDatabase collectionSouthAfricanMobileNumbers -p --port 27017
	>	db.SAMN.insertOne({id:'1');
	>	db.SAMN.find();
	>	db.SAMN.drop();

API Java Spring Boot
- download from GIT 
	git clone https://gitlab.com/alnao/South_African_Mobile_Numbers_API.git
- Developerd with "Spring Tool Suite 4"
- to run 
	java -jar ./target/SouthAfricanMobileNumbers-0.0.1-SNAPSHOT.jar
	or run in Tool Suite 4
- to run unit test in Tool Suite 4 use the class
	SouthAfricanMobileNumbersApplicationTests
- to test with Postman	
	http://localhost:5071/api/southAfricanMobileNumbersController/uploadFile
	with "Content-Type":"application/json"
	request example
	[
		{"id": "6044f51d9bf8d839c89ec1e7","idNumber":"1","phoneNumber":"27720374211","type":"","loadDate":""}
	,
		{"id": "6044f51d9bf8d839c89ec1e8","idNumber":"2","phoneNumber":"37720374211","type":"","loadDate":""}
	,
		{"id": "6044f51d9bf8d839c89ec1e9","idNumber":"3","phoneNumber":"720374211","type":"","loadDate":""}
	]

Angular Web
- download from GIT
	git clone https://gitlab.com/alnao/south_african_mobile_numbers_web.git
- developed with Visual studio code and npm
- to run  
	ng serve

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-11-11 | Spostato in `archived`; aggiunti `.nvmrc` e scheda README |


# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by [@alnao](https://github.com/alnao)
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.
