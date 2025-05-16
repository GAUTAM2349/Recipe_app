const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/database");


const Collection = sequelize.define('collection', {
  user_id: DataTypes.INTEGER,
  name: DataTypes.STRING
});

module.exports = Collection;