const AWS=require("aws-sdk");
const TABLE=process.env.TABLE;
const dynamoDb=new AWS.DynamoDB.DocumentClient();

module.exports.deleteFunction = (event,context,callback) => { console.log(event);
    const params = {TableName: TABLE , 
        Key : {id : event.pathParameters.id }
    }
    dynamoDb.delete(params , (error,data) =>{
        if (error){
            console.error(error);
            callback(new Error(error));
            return {statusCose:201};
        }
        const response =  {
            statusCode:200,
            body : JSON.stringify({"message":"Element deleted"})
        }
        callback(null, response);
    } );
}