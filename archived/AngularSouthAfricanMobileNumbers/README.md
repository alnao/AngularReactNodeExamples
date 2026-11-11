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