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

const getAllSanPham = async () => {
  const params = {
    TableName: table,
  };
  return await (await docClient.scan(params).promise()).Items;
};

const getSingleID = async (ma_sanpham) => {
  const options = {
    TableName: table,
    Key: {
      ma_sanpham: ma_sanpham,
    },
  };
  return await (await docClient.get(options).promise()).Item;
};

const addSanPham = async (sanpham) => {
  const options = {
    TableName: table,
    Item: sanpham,
  };
  return await docClient
    .put(options)
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });
};



const updateSanPham = async (sanpham) => {
  const options = {
    TableName: table,
    Key: {
      ma_sanpham: sanpham.ma_sanpham,
    },
    UpdateExpression:
      "set ten_sanpham = :name, soluong=:soLuong",
    ExpressionAttributeValues: {
      ":name": sanpham.ten_sanpham,
      ":soLuong": sanpham.soluong,
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



module.exports = {
  getAllSanPham,
  getSingleID,
  addSanPham,
  updateSanPham
};
