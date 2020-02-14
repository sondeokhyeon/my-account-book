const dotenv = require('dotenv')
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mariadb",
    dialectOptions: {
      connectTimeout: 1000,
      useUTC: false,
      timezone: process.env.DB_TIMEZONE
    },
    operatorsAliases: "Op",
    timezone: "+09:00",
    // logging:false

  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mariadb",
    operatorsAliases: "Op"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mariadb",
    operatorsAliases: "Op"
  }
};