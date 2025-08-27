const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.REGION})
const s3=new AWS.S3()

module.exports.getQuotes=(event,context,callback) => {
	console.log("Start getQuotes ", event)
	//get json file from S3
	s3.getObject({ Bucket: "alberto-input", Key: "quotes.json" }
		, function (err,data){ 
			if (err) {
				console.error(err);
				return callback(new Error(error));
			}
			var json=JSON.parse(data.Body);
			console.log("Json:", json);
			const response={ 
				headers:{"Content-Type":"application/json" /*cors?*/ },
				statusCode:200,
				body:JSON.stringify(json)
			}
			callback(null,response);
		}
	)
}