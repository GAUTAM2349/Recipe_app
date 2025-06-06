const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const ForgotPasswordRequest = sequelize.define('forgot_password_requests', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    generationTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Set the default value to the current timestamp
    },
});

module.exports =  ForgotPasswordRequest;
