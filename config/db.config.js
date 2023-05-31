module.exports = {
  HOST: "34.101.229.115",
  USER: "root",
  PASSWORD: "123",
  DB: "prodify_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
