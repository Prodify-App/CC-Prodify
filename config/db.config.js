module.exports = {
  HOST: "isi_hostname",
  USER: "nama_user",
  PASSWORD: "pw",
  DB: "database",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
