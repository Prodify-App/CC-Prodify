const express = require("express");
const imagesHandler = require("./imagesHandler.js");

const router = express.Router();

router.post("/images", imagesHandler);

const main = () => {
  const app = express();
  app.use(router);
  const port = 9002;
  app.listen(port, () => {
    console.log(`listening in http://localhost:${port}`);
  });
};

main();
