const Sequelize = require('sequelize');

const connection = new Sequelize('node-complete', 'root', 'asd123445',{
    dialect: 'mysql',
    host: 'localhost',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

module.exports = connection;