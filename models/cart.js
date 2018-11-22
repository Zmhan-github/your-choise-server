const Sequelize = require('sequelize');

const connection = require('../util/database');

const Cart = connection.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }
});

module.exports = Cart;