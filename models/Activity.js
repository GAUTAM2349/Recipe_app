const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activity = sequelize.define("activity", {
  user_id: DataTypes.INTEGER,
  activity_type: DataTypes.STRING,
  target_id: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Activity;
