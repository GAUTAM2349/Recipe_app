const sequelize  = require('../config/database');
const User = require('./User');
const Recipe = require('./Recipe');
const Favorite = require('./Favorite');
const Collection = require('./Collection');
const CollectionRecipe = require('./CollectionRecipe');
const Review = require('./Review');
const Follow = require('./Follow');
const Activity = require('./Activity');
// ***********************************************************************************************************8



User.hasMany(Recipe, { foreignKey: 'user_id' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

User.belongsToMany(Recipe, {
  through: Favorite,
  foreignKey: 'user_id',
  otherKey: 'recipe_id',
  as: 'FavoriteRecipes'
});

Recipe.belongsToMany(User, {
  through: Favorite,
  foreignKey: 'recipe_id',
  otherKey: 'user_id',
  as: 'UsersWhoFavorited'
});


User.hasMany(Collection, { foreignKey: 'user_id' });
Collection.belongsTo(User, { foreignKey: 'user_id' });


Collection.belongsToMany(Recipe, {
  through: CollectionRecipe,
  foreignKey: 'collection_id',
  otherKey: 'recipe_id'
});
Recipe.belongsToMany(Collection, {
  through: CollectionRecipe,
  foreignKey: 'recipe_id',
  otherKey: 'collection_id'
});


User.hasMany(Review, { foreignKey: 'user_id' });
Recipe.hasMany(Review, { foreignKey: 'recipe_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Recipe, { foreignKey: 'recipe_id' });


User.belongsToMany(User, {
  through: Follow,
  as: 'Followers',
  foreignKey: 'followee_id',
  otherKey: 'follower_id'
});
User.belongsToMany(User, {
  through: Follow,
  as: 'Following',
  foreignKey: 'follower_id',
  otherKey: 'followee_id'
});


User.hasMany(Activity, { foreignKey: 'user_id' });
Activity.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Recipe,
  Favorite,
  Collection,
  CollectionRecipe,
  Review,
  Follow,
  Activity,
};
