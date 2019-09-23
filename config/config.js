import dotenv from 'dotenv';
dotenv.config();

module.exports = {
    development: {
        username: process.env.USER_NAME,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        host:  process.env.DB_HOST,
        dialect: "mariadb",
        dialectOptions: {
          connectTimeout: 1000,
          useUTC: false,
          timezone:process.env.DB_TIMEZONE
        },
        operatorsAliases: "Op"
      },
      test: {
        username: '',
        password: '',
        database: '',
        host: '',
        dialect: '',
        operatorsAliases: ''
      },
      production: {
        username: '',
        password: '',
        database: '',
        host: '',
        dialect: '',
        operatorsAliases: ''
      }
};