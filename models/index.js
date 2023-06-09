const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.product = require("./product.model")(sequelize, Sequelize);
db.article = require("./article.model")(sequelize, Sequelize);

//role dan users
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

//User dan Product
db.product.belongsTo(db.user, {
  foreignKey: "id_user",
});
db.user.hasMany(db.product, {
  foreignKey: "id_user",
});

//ForignKey User dengan Article
db.article.belongsTo(db.user, {
  foreignKey: "id_user",
});
db.user.hasMany(db.article, {
  foreignKey: "id_user",
});
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
