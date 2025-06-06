const sequelize  = require('../config/database');
const User = require('./User');
const Recipe = require('./Recipe');
const Favorite = require('./Favorite');
const Collection = require('./Collection');
const CollectionRecipe = require('./CollectionRecipe');
const Review = require('./Review');
const Follow = require('./Follow');
const Activity = require('./Activity');
const ForgotPasswordRequest = require('./ForgotPasswordRequest');


// ========== ASSOCIATIONS ==========

// USER ⇄ RECIPE - from owner of recipe perspective
User.hasMany(Recipe, { foreignKey: 'user_id' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });
// USER ⇄ FAVORITES ⇄ RECIPE
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

// USER ⇄ COLLECTION
User.hasMany(Collection, { foreignKey: 'user_id' });
Collection.belongsTo(User, { foreignKey: 'user_id' });

// COLLECTION ⇄ RECIPES
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

// USER ⇄ REVIEW ⇄ RECIPE
User.hasMany(Review, { foreignKey: 'user_id' });
Recipe.hasMany(Review, { foreignKey: 'recipe_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// USER ⇄ FOLLOW (self-referencing)
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

// USER ⇄ ACTIVITY
User.hasMany(Activity, { foreignKey: 'user_id' });
Activity.belongsTo(User, { foreignKey: 'user_id' });

// ForgotPassword - User
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo( User, {
  allowNull : false
});


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
  ForgotPasswordRequest
};
