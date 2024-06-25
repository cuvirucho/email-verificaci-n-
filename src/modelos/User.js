const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const User = sequelize.define('user', {
    
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
   
    pasword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coutry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isVerify: {
        type: DataTypes.BOOLEAN,
      
        defaultValue:false
    },
});


User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}
module.exports = User;  