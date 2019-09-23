import "./env";
import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host : process.env.HOST,
    dialect : 'mariadb',
    dialectOptions: {
        connectTimeout: 1000,
        useUTC: false,
        timezone: process.env.DB_TIMEZONE,
    },
    timezone: process.env.DB_TIMEZONE,
})
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
