const AWS = require("aws-sdk");
const path = require("path");
const mime = require("mime-types"); // install using: npm install mime-types

const uploadToS3 = async (fileBuffer, fileName) => {
  const mimeType = mime.lookup(path.extname(fileName)) || "application/octet-stream";

  const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (err) {
    console.error("Upload failed", err);
    throw err;
  }
};

module.exports = uploadToS3;
