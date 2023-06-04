const { Storage } = require("@google-cloud/storage");

//Intiate storage auth
const gcs = new Storage({
  projectId: "capstone-project-prodify-app",
  keyFilename: "./serviceaccountkey.json",
});

//Nama Bucket dan koneksinya
const bucketName = "image-bucket-prodify";
const bucket = gcs.bucket(bucketName);

function getPublicUrl(fileName) {
  return "https://storage.googleapis.com/" + bucketName + "/" + fileName;
}

let imgUpload = {};

imgUpload.uploadToGcs = (req, res, next) => {
  if (!req.file) return next();

  const gcsName = new Date().toISOString();
  const file = bucket.file(gcsName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on("error", (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsName;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsName);
    next();
  });

  stream.end(req.file.buffer);
};

module.exports = imgUpload;
