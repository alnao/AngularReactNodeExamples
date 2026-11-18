// Modello per usare AwsLambdaBooks deployato su AWS.
// 1. copiare questo file in environment.aws.ts (ignorato da git: contiene la API key)
// 2. inserire l'URL (output BooksApiUrl dello stack) e il valore della API key
// 3. avviare con `npm run start:aws`
export const environment = {
  production: false,
  urlApiAws: 'https://<api-id>.execute-api.eu-central-1.amazonaws.com/dev/books',
  apiKeyAws: '<valore-della-api-key>',
  urlApiAzure: 'http://localhost:7071/api/books',
  apiKeyAzure: '',
  urlApiPhp: 'http://localhost:3000/api.php',
  urlApiStatic: 'http://localhost:3000/books',
  tipoApi :"AWS",
};
