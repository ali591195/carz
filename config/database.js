const Sequelize = require("sequelize");

//include db instance
const sequelize = new Sequelize("carz", "root", "Dsk@35124", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
