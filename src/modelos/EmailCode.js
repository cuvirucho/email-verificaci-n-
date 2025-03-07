const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const EmailCode = sequelize.define('emailCode', {
    CLAVE: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

module.exports = EmailCode;