// Modello per usare AzureFunctionBooks pubblicato su Azure.
// 1. copiare questo file in environment.azure.ts (ignorato da git: contiene la chiave)
// 2. inserire API_URL e API_KEY che start-all.sh salva in AzureFunctionBooks/.azure-config
// 3. avviare con `npm run start:azure`
export const environment = {
  production: false,
  urlApiAws: 'http://localhost:3001/books',
  apiKeyAws: '',
  urlApiAzure: 'https://<nome-function-app>.azurewebsites.net/api/books',
  apiKeyAzure: '<valore-della-function-key>',
  urlApiPhp: 'http://localhost:3000/api.php',
  urlApiStatic: 'http://localhost:3000/books',
  tipoApi :"Azure",
};
