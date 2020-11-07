const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dyamoDB = new AWS.DynamoDB();
const table = "dienvien";
const keytable = "ma_dienvien";

const params = {
  TableName: table,
  KeySchema: [
    { AttributeName: keytable, KeyType: "HASH" }, //Partition key
  ],
  AttributeDefinitions: [{ AttributeName: keytable, AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dyamoDB.createTable(params, (err, data) => {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});

module.exports = {
  dyamoDB,
  table,
  keytable,
};
