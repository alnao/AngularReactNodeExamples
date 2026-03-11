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
    let html="<ul>";
    listS3().then((lista) => { 
        lista.map((bucket) => html+="<li>"+bucket.Name+"</li>"  );
        html+="</ul>";
        response.send(html);
    });
});

// Elenco oggetti di un bucket
const { ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
app.get('/bucket/:bucketName/objects', async (req, res) => {
    try {
        const bucketName = req.params.bucketName;
        const command = new ListObjectsV2Command({ Bucket: bucketName });
        const data = await client.send(command);
        res.json(data.Contents || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Download oggetto
app.get('/bucket/:bucketName/object/:key', async (req, res) => {
    try {
        const { bucketName, key } = req.params;
        const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
        const data = await client.send(command);
        data.Body.pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload oggetto (base64, semplice)
app.post('/bucket/:bucketName/upload', express.json({limit: '10mb'}), async (req, res) => {
    try {
        const { bucketName } = req.params;
        const { key, content, encoding } = req.body;
        const buffer = Buffer.from(content, encoding || 'base64');
        const command = new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer });
        await client.send(command);
        res.json({ message: 'Upload ok', key });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancella oggetto
app.delete('/bucket/:bucketName/object/:key', async (req, res) => {
    try {
        const { bucketName, key } = req.params;
        const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
        await client.send(command);
        res.json({ message: 'Oggetto cancellato', key });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8081 , () => {
    console.log("server running on 8081 port")
});