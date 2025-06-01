const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");

const Recipe = sequelize.define("recipe", {
  user_id: DataTypes.INTEGER,
  title: DataTypes.STRING,
  ingredients: DataTypes.ARRAY(DataTypes.TEXT),
  instructions: DataTypes.TEXT,
  cook_time: DataTypes.INTEGER,
  servings: DataTypes.INTEGER,
  category: DataTypes.STRING,
  dietary_tags: DataTypes.ARRAY(DataTypes.TEXT),
  difficulty: DataTypes.STRING,
  image_url: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  approval: { type: DataTypes.STRING, defaultValue: "pending" }
});

module.exports = Recipe;
