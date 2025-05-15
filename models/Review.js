const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const Review = sequelize.define('Review', {
  user_id: DataTypes.INTEGER,
  recipe_id: DataTypes.INTEGER,
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Review;