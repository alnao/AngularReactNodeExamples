const AWS=require("aws-sdk");
const TABLE=process.env.TABLE;
const dynamoDb=new AWS.DynamoDB.DocumentClient();

module.exports.updateFunction = (event,context,callback) => { console.log(event);
    const timestamp=new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.todo !== "string" && typeof data.checked !== "boolean") {
        console.log("Validation error todo type");
        return {statusCose:500};
    }
    const params = {TableName: TABLE , 
        Key : {id : event.pathParameters.id },
        ExpressionAttributeNames: { "#todo_text" : "todo"},
        ExpressionAttributeValues: { ":todo" : data.todo , ":checked" : data.checked , ":updatedAt" : timestamp },
        UpdateExpression: "SET #todo_text = :todo, checked = :checked , updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params , (error,data) =>{
        if (error){
            console.error(error);
            callback(new Error(error));
            return {statusCose:201};
        }
        const response =  {
            statusCode:200,
            body : JSON.stringify(data.Attributes)
        }
        callback(null, response);
    } );
}