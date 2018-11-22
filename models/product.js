const Sequelize = require('sequelize');

const connection = require('../util/database');

const Product = connection.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age_start: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 100}
    },
    age_end: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 100}
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    direction: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Product;