module.exports = {
  HOST: "isi_dengan_host",
  USER: "_isi_dengan_user",
  PASSWORD: "isi_dengan_pass",
  DB: "isi_dengan_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
