const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("prodify_roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  return Role;
};
