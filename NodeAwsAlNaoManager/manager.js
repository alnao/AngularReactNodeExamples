const express = require('express');
const app = express();
//var AWS = require('aws-sdk');
//import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"; //see https://www.npmjs.com/package/@aws-sdk/client-s3
//import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
//const ListBucketsCommand,S3Client = require('@aws-sdk/client-s3');
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
    console.log("server running")
});

/*

*/