const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const CollectionRecipe = sequelize.define('CollectionRecipe', {
  collection_id: DataTypes.INTEGER,
  recipe_id: DataTypes.INTEGER
}, {
  timestamps: false
});

module.exports = CollectionRecipe;