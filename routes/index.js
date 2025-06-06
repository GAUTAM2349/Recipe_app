const authRouter = require('./auth');
const userRouter = require('./user');
const recipeRouter = require('./recipe');
const followRouter = require('./follow');
const favoriteRouter = require('./favorite');
const reviewRouter = require('./review');
const activityRouter = require('./activity');
const collectionRouter = require('./collection');
const adminRouter = require('./admin');
const passwordRouter = require('./password');

module.exports = {
  authRouter,
  userRouter,
  recipeRouter,
  followRouter,
  favoriteRouter,
  reviewRouter,
  activityRouter,
  collectionRouter,
  adminRouter,
  passwordRouter
};
