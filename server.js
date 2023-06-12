const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const prodifyRouter = require("./src/productsHandler");
const prodifyArticles = require("./src/articlesHandler");

const cors = require("cors");

const db = require("./models");

db.sequelize.sync();

let corsOptions = {
  origin: "http://localhost:9001",
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use(prodifyRouter);
app.use(prodifyArticles);

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.get("/", (req, res) => {
  console.log("Response Success");
  res.send("Good Job the API is working successfully");
});

const PORT = process.env.PORT || 9002;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
