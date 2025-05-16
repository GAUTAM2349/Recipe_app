const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const Favorite = sequelize.define('favorite', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false
});

module.exports = Favorite;