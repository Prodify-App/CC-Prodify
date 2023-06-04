module.exports = {
  HOST: "isi_hostname",
  USER: "isi_user",
  PASSWORD: "isi_password",
  DB: "isi_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
