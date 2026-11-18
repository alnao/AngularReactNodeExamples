// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Con tipoApi "AWS" questo è il server locale di AwsLambdaBooks (npm run local, porta 3001).
  // Per usare lo stack su AWS: copiare environment.aws.example.ts in environment.aws.ts
  // e avviare con `npm run start:aws` (vedi README).
  urlApiAws: 'http://localhost:3001/books',
  apiKeyAws: '', // in locale non serve
  // Con tipoApi "Azure" questo è l'host locale di AzureFunctionBooks (npm start, porta 7071).
  // Per usare Azure: copiare environment.azure.example.ts in environment.azure.ts
  // e avviare con `npm run start:azure` (vedi README).
  urlApiAzure: 'http://localhost:7071/api/books',
  apiKeyAzure: '', // in locale non serve
  urlApiPhp: 'http://localhost:3000/api.php',
  urlApiStatic: 'http://localhost:3000/books',
  tipoApi :"AWS" ,//"PHP" //"AWS" //"Azure" //"Static"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
