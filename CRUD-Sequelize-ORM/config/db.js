const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "testdb",       
  "root",         
  "Bhagya@012026",   
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

module.exports = sequelize;
