const { OpsWorks } = require("aws-sdk");
const AWS = require("aws-sdk");
const BUCKET_NAME = "dienvien-bucket";
require("dotenv").config();

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const { table } = require("./createTable");

const getAllDienVien = async () => {
  const params = {
    TableName: table,
  };
  return await (await docClient.scan(params).promise()).Items;
};

const getSingleID = async (ma_dienvien) => {
  const options = {
    TableName: table,
    Key: {
      ma_dienvien: ma_dienvien,
    },
  };
  return await (await docClient.get(options).promise()).Item;
};

const addDienVien = async (dienvien) => {
  const options = {
    TableName: table,
    Item: dienvien,
  };
  return await docClient
    .put(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const deleteDienVien = async (ma_dienvien) => {
  const options = {
    TableName: table,
    Key: {
      ma_dienvien: ma_dienvien,
    },
  };
  return await docClient
    .delete(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const updateDienvien = async (dienvien) => {
  console.log(dienvien);
  const options = {
    TableName: table,
    Key: {
      ma_dienvien: dienvien.ma_dienvien,
    },
    UpdateExpression:
      "set ten_dienvien = :name, namsinh=:birthday, avatar=:avatar",
    ExpressionAttributeValues: {
      ":name": dienvien.ten_dienvien,
      ":birthday": dienvien.namsinh,
      ":avatar": dienvien.avatar,
    },
    ReturnValues: "UPDATED_NEW",
  };

  return await docClient
    .update(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const uploadAvatar = async (avatar) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: avatar.name,
    Body: avatar.data,
    ACL: "public-read",
  };
  return await (await s3.upload(params).promise()).Location;
};

module.exports = {
  getAllDienVien,
  getSingleID,
  addDienVien,
  deleteDienVien,
  updateDienvien,

  uploadAvatar,
};
