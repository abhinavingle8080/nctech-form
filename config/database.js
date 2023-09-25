// config/database.js
const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize({
//     dialect: 'mysql',
//     database: 'if0_34640061_nct_test',
//     username: 'if0_34640061',
//     password: 'JxzDDbsuuA',
//     host: 'sql304.infinityfree.com',
//     port: 3306
// });

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: 'sdm',
    username: 'root',
    password: '1289',
    host: 'localhost',
    port: 3306
});

module.exports = sequelize;
