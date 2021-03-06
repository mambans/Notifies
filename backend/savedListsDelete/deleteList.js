'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username, listName }) => {
  const res = await client
    .update({
      TableName: process.env.SAVED_LISTS,
      Key: { Username: username },
      UpdateExpression: `REMOVE #list`,
      ExpressionAttributeNames: {
        '#list': listName,
      },
    })
    .promise();

  console.log('res', res);

  return res;
};
