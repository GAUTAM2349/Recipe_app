const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const Favorite = sequelize.define('Favorite', {
  user_id: DataTypes.INTEGER,
  recipe_id: DataTypes.INTEGER
}, {
  timestamps: false
});

module.exports = Favorite;