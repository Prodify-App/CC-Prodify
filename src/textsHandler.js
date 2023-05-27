const { nanoid } = require("nanoid");
const { Storage } = require("@google-cloud/storage");
const texts = require("./text");
const path = require("path");
const { response } = require("express");

const pathKey = path.resolve("./serviceaccountkey.json");

const storage = new Storage({
  projectId: "capstone-project-prodify-app",
  keyFilename: pathKey,
});

const bucketName = "text-bucket-prodify";

const addTextHandler = async (req, res) => {
  const { title, category, description } = req.body;
  const emptyTitle = !title;

  if (emptyTitle) {
    return response.status(400).json({
      status: "Fail",
      message: "Please fill the title",
    });
  }

  const id = nanoid(10);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newText = {
    title,
    category,
    description,
    id,
    createdAt,
    updatedAt,
  };

  texts.push(newText);

  const jsonContent = JSON.stringify(newText);

  const dateCreated = new Date(createdAt).toISOString().slice(0, 10);
  const fileName = `text_${dateCreated}_${id}.json`;

  try {
    const file = storage.bucket(bucketName).file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: "application/json",
      },
    });

    stream.write(jsonContent);

    await new Promise((resolve, reject) => {
      stream.end(() => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });

    return res.status(200).json({
      status: "success",
      message: "Text has been uploaded",
      data: {
        textId: id,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      status: "Error",
      message: "Failed to upload text",
    });
  }
};

const getAllTextsHandler = async (req, res) => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();

    const texts = [];
    for (const file of files) {
      const [dataBuffer] = await file.download();
      const jsonContent = dataBuffer.toString();
      const text = JSON.parse(jsonContent);
      texts.push(text);
    }
    return res.status(200).json({
      status: "Success",
      data: {
        texts,
      },
    });
  } catch (error) {
    console.log("Error retrieving files:", error);
    return res.status(500).json({
      status: "Error",
      message: "Failed to retrieve texts",
    });
  }
};

const getTextsByIdHandler = async (req, res) => {
  //Coba edit bagian request paramsnya nanti
  const id = req.params.id;

  try {
    const [files] = await storage.bucket(bucketName).getFiles();

    const matchingFiles = files.filter((file) => {
      const fileName = file.name;
      const extractedId = fileName.match(
        /text_\d{4}-\d{2}-\d{2}_([^.]*)\.json/
      )[1];
      return extractedId === id;
    });

    if (matchingFiles.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "file not found",
      });
    }

    const file = matchingFiles[0];
    const [dataBuffer] = await file.download();
    const jsonContent = dataBuffer.toString();
    const text = JSON.parse(jsonContent);

    return res.status(200).json({
      status: "Success",
      data: {
        text,
      },
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return res.status(400).json({
      status: "Error",
      message: "Failed to retieve text",
    });
  }
};

const editTextsByIdHandler = async (req, res) => {
  const id = req.params.id;
  const { title, category, description } = req.body;
  const updatedAt = new Date().toISOString();

  if (!title) {
    return res.status(400).json({
      status: "Fail",
      message: "Fail to renew Title, Please fill your desired Title",
    });
  }

  try {
    const [files] = await storage.bucket(bucketName).getFiles();

    const matchingFile = files.find((file) => {
      const fileName = file.name;
      const regex = /text_\d{4}-\d{2}-\d{2}_([^.]*)\.json/;
      const match = regex.exec(fileName);
      if (match && match[1] === id) {
        return true;
      }
      return false;
    });

    if (!matchingFile) {
      return res.status(400).json({
        status: "Fail",
        message: "File not found",
      });
    }

    const file = matchingFile;
    const jsonContent = JSON.stringify({
      title,
      category,
      description,
      id,
      createdAt: file.metadata.timeCreated,
      updatedAt,
    });

    const stream = file.createWriteStream({
      metadata: {
        contentType: "application/json",
      },
    });

    stream.write(jsonContent);

    await new Promise((resolve, reject) => {
      stream.end(() => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });

    return res.status(200).json({
      status: "Success",
      messange: "File has been Updated",
    });
  } catch (error) {
    console.error("Error updating files", error);
    return res.status(400).json({
      status: "Fail",
      message: "Fail to updated text, ID not found",
    });
  }
};

const deleteTextByIdHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const [files] = await storage.bucket(bucketName).getFiles();

    const matchingFile = files.find((file) => {
      const fileName = file.name;
      const regex = /text_\d{4}-\d{2}-\d{2}_([^.]*)\.json/;
      const match = regex.exec(fileName);
      if (match && match[1] === id) {
        return true;
      }
      return false;
    });

    if (!matchingFile) {
      return res.status(404).json({
        status: "Fail",
        message: "File not found",
      });
    }

    const file = matchingFile;

    await storage.bucket(bucketName).file(file.name).delete();

    return res.status(200).json({
      status: "Success",
      message: "Text has been deleted",
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
      message: "text failed to be destroyed since the ID not found",
    });
  }
};

module.exports = {
  addTextHandler,
  getAllTextsHandler,
  getTextsByIdHandler,
  editTextsByIdHandler,
  deleteTextByIdHandler,
};
