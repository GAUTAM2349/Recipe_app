const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const CollectionRecipe = sequelize.define('collection_recipe', {
  collection_id: DataTypes.INTEGER,
  recipe_id: DataTypes.INTEGER
}, {
  timestamps: false
});

module.exports = CollectionRecipe;