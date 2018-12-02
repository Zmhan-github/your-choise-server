const Sequelize = require('sequelize');

const connection = require('../util/database');

const Message = connection.define('message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    msgTema: Sequelize.STRING,
    msg: Sequelize.STRING
});


module.exports = Message;