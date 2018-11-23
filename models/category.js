const Sequelize = require('sequelize');

const connection = require('../util/database');

const Category = connection.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


module.exports = Category;