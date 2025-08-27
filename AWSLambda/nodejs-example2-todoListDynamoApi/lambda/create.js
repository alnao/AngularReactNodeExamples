const AWS=require("aws-sdk");
const TABLE=process.env.TABLE;
const dynamoDb=new AWS.DynamoDB.DocumentClient();
const uuid=require('uuid');
module.exports.createFunction = (event,context,callback) => { console.log(event);
    const timestamp=new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.todo !== "string") {
        console.log("Validation error todo type");
        return {statusCose:500};
    }
    const params = {TableName: TABLE , 
        Item : { id : uuid.v1(), todo : data.todo, checked: false , createdAt: timestamp, updatedAt: timestamp }
    }
    dynamoDb.put(params , (error,data) =>{
        if (error){
            console.error(error);
            callback(new Error(error));
            return {statusCose:201};
        }
        const response = {
            statusCode:200,
            body : JSON.stringify(data.Item)
        }
        callback(null, response);
        //NO return {statusCose:201};
    } );
}

/* with async
exports.createFunction = async(event,context) => {
    return {
        statusCose:200,
        body : JSON.stringify({message: "Hello"})
    }
}
*/