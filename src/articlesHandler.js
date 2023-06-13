const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const Multer = require("multer");
const imgUpload = require("./imagesHandler");
const config = require("../config/db.config");
const db = require("../models");

const Article = db.article;

const multer = Multer({
  storage: Multer.MemoryStorage,
  filesize: 5 * 1024 * 1024,
});

//Connection to Database in Cloud SQL
const connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  database: config.DB,
  password: config.PASSWORD,
});

router.post(
  "/insertArticles",
  multer.single("image"),
  imgUpload.uploadToGcs,
  (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    let imageUrl = "";
    if (req.file && req.file.cloudStoragePublicUrl) {
      imageUrl = req.file.cloudStoragePublicUrl;
    }
    const id_user = req.body.id_user;

    if (!title || !description) {
      const reponse = res.status(400).send({
        Status: "Fail",
        Message: "Please fill the title and description",
      });
      return reponse;
    }

    Article.create({
      title: title,
      description: description,
      imageURL: imageUrl,
      id_user: id_user,
    })
      .then((createdArticle) => {
        res.status(201).send({
          Status: "Success",
          Message: "Articles Uploaded",
          Title: createdArticle.title,
          Description: createdArticle.description,
          imageURL: createdArticle.imageUrl,
        });
      })
      .catch((err) => {
        res.status(500).send({ Message: err.message });
      });
  }
);

router.get("/getArticles", (req, res) => {
  const query = "SELECT title, description, imageURL FROM articles";

  connection.query(query, (err, rows, field) => {
    if (err) {
      res.status(500).send({ Message: err.message });
    } else {
      res.status(200).send({
        Status: "Success",
        Message: "Article Retrieved",
        Articles: rows,
      });
    }
  });
});

router.get("/getArticles/user/:id", (req, res) => {
  const id = req.params.id;

  const query =
    "SELECT articles.title, articles.description, articles.imageURL from articles INNER JOIN prodify_users ON prodify_users.id=articles.id_user WHERE id_user = ?";
  connection.query(query, [id], (err, rows, field) => {
    if (err) {
      res.status(500).send({ Message: err.message });
    } else {
      res.status(200).send({
        Status: "Success",
        Message: "Articles Retrieved",
        userArticles: rows,
      });
    }
  });
});

router.get("/getArticles/articles/:id", (req, res) => {
  const id = req.params.id;

  const query = "SELECT title, description, imageURL FROM articles";

  connection.query(query, [id], (err, rows, field) => {
    if (err) {
      res.status(500).send({ Message: err.message });
    } else {
      res.status(200).send(rows[0]);
    }
  });
});
//Tambahin Get yang lain
module.exports = router;
