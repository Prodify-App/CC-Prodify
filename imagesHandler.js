const util = require("util");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const { url } = require("inspector");

let processFile = Multer({
  storage: Multer.memoryStorage(),
}).single("file");
console.log(processFile);

let processFileMiddleware = util.promisify(processFile);

//Intiate storage auth
const storage = new Storage({
  projectId: "capstone-project-prodify-app",
  keyFilename: "./serviceaccountkey.json",
});
const bucket = storage.bucket("image-bucket-prodify");

const imageHandler = async (req, res) => {
  try {
    await processFileMiddleware(req, res);

    if (!req.file) {
      return res.status(400).send({ messange: "Please upload a file!" });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      const publicURL = new URL(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message: `Uploaded the file successfully: ${req.file.originalname}, but public access denied`,
          url: publicURL,
        });
      }

      res.status(200).send({
        message: "uploaded the file successfully: " + req.file.originalname,
        url: publicURL,
      });
    });
    blobStream.end(req.file.buffer);
  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "file size cannot be larger than 25MB",
      });
    }
  }
};

module.exports = imageHandler;
