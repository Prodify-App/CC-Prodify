const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const prodifyRouter = require("./src/recordHandler");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(prodifyRouter);

app.get("/", (req, res) => {
  console.log("Response Success");
  res.send("Good Job the API is working successfully");
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`listening in http://localhost:${port}`);
});
