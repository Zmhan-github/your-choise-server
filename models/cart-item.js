const Sequelize = require('sequelize');

const connection = require('../util/database');

const CartItem = connection.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;