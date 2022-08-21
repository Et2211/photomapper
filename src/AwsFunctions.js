import * as AWS from 'aws-sdk'
const configuration = {
    region: 'eu-west-2',
    secretAccessKey: 'qrAUU6QJCfdUds7HycKkVP4My3znwhdM53GU9rgp',
    accessKeyId: 'AKIA3NR22ECEJVV2CTLM'
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