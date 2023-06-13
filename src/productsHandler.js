const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const Multer = require("multer");
const imgUpload = require("./imagesHandler");
const { authJwt } = require("../middleware");
const config = require("../config/db.config");
const db = require("../models");

const Product = db.product;

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
  [authJwt.verifyToken],
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
    const id_user = req.body.id_user;

    if (!title) {
      const response = res.status(400).send({
        Status: "Fail",
        Message: "Please fill the title",
      });
      return response;
    }

    if (!id_user) {
      const response = res.status(400).send({
        Status: "Fail",
        Message: "Please fill User ID",
      });
      return response;
    }

    Product.create({
      title: title,
      category: category,
      description: description,
      imageURL: imageUrl,
      id_user: id_user,
    })
      .then((createdProduct) => {
        res.status(201).send({
          Status: "Success",
          Message: "Insert Successful",
          Title: createdProduct.title,
          Category: createdProduct.category,
          Description: createdProduct.description,
          imageURL: createdProduct.imageUrl,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });

    // res.status(201).send({
    //   status: "Success",
    //   message: "Insert Successful",
    //   title: title,
    //   category: category,
    //   description: description,
    //   imageURL: imageUrl,
    // });

    // res.status(500).send({ message: err.message });

    // res.status(201).send({

    // });

    // res.status(500).send({
    //   message: err.message,
    // });
  }
);

router.post(
  "/prodifyImage",
  multer.single("image"),
  imgUpload.uploadToGcs,
  (req, res, next) => {
    const data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }

    res.send(data);
  }
);

//Yang original ini adalah get reqeust yang belum ada foreign key ke Table User

// router.get("/getProducts", (req, res) => {
//   const query = "SELECT * FROM prodify_products";
//   connection.query(query, (err, rows, field) => {
//     if (err) {
//       res.status(500).send({ message: err.message });
//     } else {
//       res.status(200).json(rows);
//     }
//   });
// });

// router.get("/getProducts/:id", [authJwt.verifyToken], (req, res) => {
//   const id = req.params.id;

//   const query = "SELECT * FROM prodify_products WHERE id = ?";
//   connection.query(query, [id], (err, rows, field) => {
//     if (err) {
//       res.status(404).send({ message: err.message });
//     } else {
//       res.status(200).json(rows[0]);
//     }
//   });
// });

//Punya Sequalize

router.get("/getProducts", [authJwt.verifyToken], (req, res) => {
  const query = "SELECT * FROM products";
  connection.query(query, (err, rows, field) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.status(200).send({
        Status: "Success",
        Message: "Products Retrieved",
        listProducts: rows,
      });
    }
  });
});

router.get("/getProducts/user/:iduser", [authJwt.verifyToken], (req, res) => {
  const iduser = req.params.iduser;

  const query =
    "SELECT products.title, products.category, products.description, products.imageURL FROM products INNER JOIN prodify_users ON products.id_user=prodify_users.id WHERE id_user = ?";
  connection.query(query, [iduser], (err, rows, field) => {
    if (err) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(200).send({
        Status: "Success",
        Message: "User Product Retrieved",
        userProducts: rows,
      });
    }
  });
});

router.get(
  "/getProducts/product/:idproduct",
  [authJwt.verifyToken],
  (req, res) => {
    const idproduct = req.params.idproduct;

    const query = "SELECT * FROM products WHERE id = ?";
    connection.query(query, [idproduct], (err, rows, field) => {
      if (err) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(200).send(rows[0]);
      }
    });
  }
);

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
