const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const Multer = require("multer");
const imgUpload = require("./imagesHandler");
const { authJwt } = require("../middleware");
const config = require("../config/db.config");

//MIddleware Untuk upload gambar
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

// router ini untuk post data text beserta gambar
// ternyata selama ini memang bareng kirimnya secara quest post
// yang bedain hanya ketika ada gambar yang urus itu bagian cloud storage
// kemudian dibagian router ini hanya ambil linknya saja
router.post(
  "/insertProducts",
  multer.single("attachment"),
  imgUpload.uploadToGcs,
  (req, res) => {
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    let imageUrl = "";

    if (req.file && req.file.cloudStoragePublicUrl) {
      imageUrl = req.file.cloudStoragePublicUrl;
    }

    const query =
      "INSERT INTO prodify_products (title, category, description, imageURL) VALUES (?, ?, ?, ?)";

    connection.query(
      query,
      [title, category, description, imageUrl],
      (err, rows, fields) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(201).send({
            status: "Success",
            message: "Insert Successful",
            title: title,
            category: category,
            description: description,
            imageURL: imageUrl,
          });
        }
      }
    );
  }
);

router.post(
  "/prodifyImage",
  multer.single("image"),
  imgUpload.uploadToGcs,
  (req, res, next) => {
    const data = req.body;
    if (req.file ** req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }

    res.send(data);
  }
);

router.get("/getProducts", (req, res) => {
  const query = "SELECT * FROM prodify_products";
  connection.query(query, (err, rows, field) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

router.get("/getProducts/:id", (req, res) => {
  const id = req.params.id;

  const query = "SELECT * FROM prodify_products WHERE id = ?";
  connection.query(query, [id], (err, rows, field) => {
    if (err) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

router.put(
  "/editProducts/:id",
  multer.single("attachment"),
  imgUpload.uploadToGcs,
  (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    let imageUrl = "";

    if (req.file && req.file.cloudStoragePublicUrl) {
      imageUrl = req.file.cloudStoragePublicUrl;
    }

    const query =
      "UPDATE prodify_products SET title = ?, category = ?, description = ?, imageURL = ? WHERE id = ?";

    connection.query(
      query,
      [title, category, description, imageUrl, id],
      (err, rows, fields) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(200).send({ message: "Update Successful" });
        }
      }
    );
  }
);

router.delete("/deleteProducts/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM prodify_products WHERE id = ?";
  connection.query(query, [id], (err, rows, fields) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send({ message: "Delete Sucessful" });
    }
  });
});
module.exports = router;
