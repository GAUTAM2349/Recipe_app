const { DataTypes } = require("sequelize");
const sequelize  = require("../config/database");

const User = sequelize.define("user", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.TEXT,
  bio: DataTypes.TEXT,
  profile_picture: DataTypes.TEXT,
  role: { type: DataTypes.STRING, defaultValue: "user" },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isBanned: { type: DataTypes.BOOLEAN, defaultValue: false},
});

module.exports = User;
