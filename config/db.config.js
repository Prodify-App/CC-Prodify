module.exports = {
  HOST: "isi_dengan_hostname",
  USER: "isi_dengan_user",
  PASSWORD: "password_user",
  DB: "db_punya_kita",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
