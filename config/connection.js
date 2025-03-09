const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql", 
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      ssl: {
        require: true, // 
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;