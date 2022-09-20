const express = require('express');
const path = require('path');
const AWS = require('aws-sdk')
const app = express();

const keys = {
  region: 'eu-west-2',
  secretAccessKey: 'qrAUU6QJCfdUds7HycKkVP4My3znwhdM53GU9rgp',
  accessKeyId: 'AKIA3NR22ECEJVV2CTLM'
}


const configuration = {
    region: keys.region,
    secretAccessKey: keys.secretAccessKey,
    accessKeyId: keys.accessKeyId
}

AWS.config.update(configuration)

var documentClient = new AWS.DynamoDB.DocumentClient();
const scanTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };

    const scanResults = [];
    let items;
    do{
        items =  await documentClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey !== "undefined");
    
    return scanResults;

};


app.use(express.static(path.join(__dirname, 'build')));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/data', function (req, res) {
  scanTable('Photos').then((response)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(response);
  })
});

app.listen(9000);