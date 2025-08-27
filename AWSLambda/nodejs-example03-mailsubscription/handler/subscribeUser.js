const AWS = require("aws-sdk")
const uuid = require('uuid');
AWS.config.update({ region: process.env.REGION})

const USERS_TABLE= process.env.USERS_TABLE;
const DYNAMO_DB=new AWS.DynamoDB.DocumentClient();

module.exports.subscribeUser=(event,context,callback) => {
    const json=JSON.parse(event.body);
    console.log("EVENT: " , json);
    const timestamp= new Date().getTime();
    if (typeof json.email !== "string"){
        console.error("Email not valid");
        return;
    }
    const param={
        TableName:USERS_TABLE,
        Item : {
            userId:uuid.v4(),
            email:json.email,
            createdAt:timestamp,
            updatedAt:timestamp,
            substriber:true
        }
    }
    DYNAMO_DB.put(param , (error,data) =>{
        if (error){
            console.error(error);
            return callback(new Error(error));
        }
        const response={statusCode:200,body:JSON.stringify(data.Item)};
        callback(null,response);
    });

}