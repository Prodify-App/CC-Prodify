const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./models");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resnyc Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
let corsOptions = {
  origin: "http://localhost:9001",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("API is Work, I guess...");
  console.log("Response Success");
});

const PORT = process.env.PORT || 9003;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
