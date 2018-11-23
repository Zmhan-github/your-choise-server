const Sequelize = require('sequelize');

const connection = require('../util/database');

const User = connection.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    phone: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    age: Sequelize.STRING,
    gender: Sequelize.STRING,
    status: Sequelize.STRING,
    priceStart: Sequelize.INTEGER,
    priceEnd: Sequelize.INTEGER
});


module.exports = User;