const express = require("express");
const imagesHandler = require("./src/imagesHandler.js");
const {
  getAllTextsHandler,
  addTextHandler,
  getTextsByIdHandler,
  editTextsByIdHandler,
  deleteTextByIdHandler,
} = require("./src/textsHandler.js");

const router = express.Router();
const app = express();
app.use(express.json());

router.post("/images", imagesHandler);
router.post("/texts", addTextHandler);
router.get("/texts", getAllTextsHandler);
router.get("/texts/:id", getTextsByIdHandler);
router.put("/texts/:id", editTextsByIdHandler);
router.delete("/texts/:id", deleteTextByIdHandler);

const main = () => {
  app.use(router);
  const port = 9002;
  app.listen(port, () => {
    console.log(`listening in http://localhost:${port}`);
  });
};

main();
