const express = require('express');
const path = require('path');
const AWS = require('aws-sdk')
var bodyParser = require('body-parser');
const { response } = require('express');
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

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

const uploadToS3 = (fileContent, name, type, username, photoName, lat, lng, callback) => {
  //const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
      Bucket: 'photo-mapper',
      Key: 'Photos/' + photoName + Date.now() + '.jpg', // File name you want to save as in S3
      Body: fileContent,
      type: type,
      ContentType: 'image/jpeg',
      ContentEncoding: 'base64',
  };

  // Uploading files to the bucket
   s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      } else {
        console.log(data.Location)
      }

      const dynamoData = {
          PhotoID: photoName + Date.now(),
          username: username,
          photoName: photoName, 
          lat: lat, 
          lng: lng, 
          url: data.Location,
          date: Date.now()
      }
      putData('Photos', dynamoData, callback)
  });
}

const putData = (tableName , data, callback) => {
  var params = {
      TableName: tableName,
      Item: data,
  }
  console.log(params)
  
  documentClient.put(params, function (err, data) {
      if (err) {
          console.log('Error')
          callback()

      } else {
          console.log('Success')
          callback()

      }
  })
}



app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json())
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

app.post('/add-photo', async function (req, res) {
  const base64Data = new Buffer.from(req.body.photoData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  uploadToS3(base64Data, req.body.fileName, 'image/jpeg', req.body.username, req.body.photoName, req.body.lat, req.body.lng, ()=>{res.status(200).json({status:"ok"})})
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});