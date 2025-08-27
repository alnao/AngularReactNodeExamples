const AWS=require("aws-sdk");
const TABLE=process.env.TABLE;
const dynamoDb=new AWS.DynamoDB.DocumentClient();
module.exports.listFunction = (event,context,callback) => { console.log(event);
    const params = {TableName: TABLE }
    dynamoDb.scan(params , (error,data) =>{
        if (error){
            console.error(error);
            callback(new Error(error));
            return {statusCose:201};
        }
        const response = {
            statusCode:200,
            body : JSON.stringify(data.Items)
        }
        callback(null, response);
    } );
}

module.exports.getFunction = (event,context,callback) => { console.log(event);
    const params = {TableName: TABLE , 
        Key : {id : event.pathParameters.id }
    }
    dynamoDb.get(params , (error,data) =>{
        if (error){
            console.error(error);
            callback(new Error(error));
            return {statusCose:201};
        }
        const response = data.Item ? {
            statusCode:200,
            body : JSON.stringify(data.Item)
        } : {
            statusCode:404,
            body : JSON.stringify({"message":"Element not found"})
        }
        callback(null, response);
    } );
}