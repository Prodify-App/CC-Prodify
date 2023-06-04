const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const prodifyRouter = require("./src/recordHandler");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(prodifyRouter);

const cors = require("cors");

const db = require("./models");
const Role = db.role;

db.sequelize.sync();

let corsOptions = {
  origin: "http://localhost:9001",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.get("/", (req, res) => {
  console.log("Response Success");
  res.send("Good Job the API is working successfully");
});

//app engine pake port 9002 di service defaultnya
const PORT = process.env.PORT || 9002;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
