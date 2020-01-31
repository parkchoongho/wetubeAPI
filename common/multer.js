const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-1"
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "wetube-api/video"
  })
});

const uploadMulter = multerVideo.single("videoFile");

module.exports = uploadMulter;
