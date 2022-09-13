import * as AWS from 'aws-sdk'
import {loadPlaces} from './redux/actions/placeActions'
import {keys} from './config'


const configuration = {
    region: keys.region,
    secretAccessKey: keys.secretAccessKey,
    accessKeyId: keys.accessKeyId
}

AWS.config.update(configuration)

const docClient = new AWS.DynamoDB.DocumentClient()

export const fetchData = async (tableName, callback) => {

    var params = {
        TableName: tableName
    }

    await docClient.scan(params, function (err, data) {
        if (!err) {
            callback(data)
        } else {
            console.log(err)
        }
    })
}

export const putData = (tableName , data, refreshPlaces) => {
    var params = {
        TableName: tableName,
        Item: data,
    }
    console.log(params)
    
    docClient.put(params, function (err, data) {
        if (err) {
            console.log('Error', err)
        } else {
            console.log('Success', data)
            fetchData('Photos', refreshPlaces)
        }
    })
}

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
});

export const uploadToS3 = (fileContent, name, type, username, photoName, lat, lng, refreshPlaces) => {
    //const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'photo-mapper',
        Key: 'Photos/' + name, // File name you want to save as in S3
        Body: fileContent,
        type: type,
        ContentType: type,
    };

    // Uploading files to the bucket
     s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);

        const dynamoData = {
            PhotoID: photoName + Date.now(),
            username: username,
            photoName: photoName, 
            lat: lat, 
            lng: lng, 
            url: data.Location
        }
        putData('Photos', dynamoData, refreshPlaces)
    });
}