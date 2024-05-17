# Node AWS AlNao Manager

## Creazione del progetto
Comandi per la creazione
```
npm init
npm install -g express
node manager.js
npm install @aws-sdk/client-s3
```

Primo esempio di codice con recupero elenco bucket S3 preso dalla [documentazione ufficiale](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html):
```
const express = require('express');
const app = express();
const { S3Client,ListBucketsCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({});
app.get('/', function(request, response){    //response.sendFile('absolutePathToYour/htmlPage.html');
    const ts=Date.now();
    const html="<h1>Hello</h1>";
    response.send(html);
});
//https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
const listS3 = async () => {
    const command = new ListBucketsCommand({});
    const { Buckets } = await client.send(command);
    console.log("Buckets: ");
    console.log(Buckets.map((bucket) => bucket.Name).join("\n"));
    return Buckets;
};
app.get('/bucket', function(request, response){ 
    html="<ul>";
    listS3().then((lista) => { 
        lista.map((bucket) => html+="<li>"+bucket.Name+"</li>"  );
        html+="</ul>";
        response.send(html);
    });

});
app.listen(8081 , () => {
    console.log("server running on 8081 port")
});
```