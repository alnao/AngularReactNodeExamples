# AwsLambdaExamples

Esempio preso da https://github.com/serverless/examples/tree/v3/aws-node-rest-api-with-dynamodb

## nodejs-crud-dynamo

To install NPM packges
```
$ npm install
```

To deploy lambda on AWS
```
$ serverless deploy -v
```

## Test

Create

```
$ curl -X POST https://7l4m9lh628.execute-api.eu-west-1.amazonaws.com/dev/todos --data '{ "text": "Prova" }'
```

List all Todos

```
$ curl https://7l4m9lh628.execute-api.eu-west-1.amazonaws.com/dev/todos
```

Get one
```
$ curl https://7l4m9lh628.execute-api.eu-west-1.amazonaws.com/dev/todos/<id>
```

Put one
```
$ curl -X PUT https://7l4m9lh628.execute-api.eu-west-1.amazonaws.com/dev/todos/<id> --data '{ "text": "Learn Serverless", "checked": true }'
```

Delete a Todo
```
$ curl -X DELETE https://7l4m9lh628.execute-api.eu-west-1.amazonaws.com/dev/todos/<id>
```


## Per tutte le lambda create
Gestione dei log da AWS lambda dentro il Pannello di controllo nelle chiamate ed esecuzioni e su monitoraggio si vedono i log in CloudWatch Logs InsightsInfo
Oppure da riga di comando con
```
$ sls logs -f <nome> --startTime 5h
```
per vedere le ultime 5 ore oppure in tail con il comando
```
$ sls logs -f <nome> -t 
```
Per rimuovere tutto basta lanciare il comando da dentro la cartella della lambda
```
$ sls remove
```
questo comando rimuove la lambda, i bucket s3, i log e le dipendenze (non l'utenza IAM serverless-admin)




