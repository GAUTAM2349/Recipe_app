const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const Collection = sequelize.define('collection', {
  name: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
});

module.exports = Collection;