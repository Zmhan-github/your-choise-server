const Sequelize = require('sequelize');

const connection = require('../util/database');

const Zayavka = connection.define('zayavka', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});


module.exports = Zayavka;