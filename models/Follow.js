const { DataTypes } = require("sequelize");
const sequelize  = require("../config/database");

const Follow = sequelize.define('follow', {
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = Follow;