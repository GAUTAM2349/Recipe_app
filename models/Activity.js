const { DataTypes } = require("sequelize");
const sequelize  = require("../config/database");


const Activity = sequelize.define('Activity', {
  user_id: DataTypes.INTEGER,
  type: DataTypes.STRING,
  target_id: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Activity;