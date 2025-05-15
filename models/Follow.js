const { DataTypes } = require("sequelize");
const sequelize  = require("../config/database");

const Follow = sequelize.define('Follow', {
  follower_id: DataTypes.INTEGER,
  followee_id: DataTypes.INTEGER
}, {
  timestamps: false
});

module.exports = Follow;