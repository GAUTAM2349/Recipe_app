const authRouter = require('./auth');
const userRouter = require('./user');
const recipeRouter = require('./recipe');
const followRouter = require('./follow');
const favoriteRouter = require('./favorite');
const reviewRouter = require('./review');
const activityRouter = require('./activity');
const collectionRouter = require('./collection');

module.exports = {
  authRouter,
  userRouter,
  recipeRouter,
  followRouter,
  favoriteRouter,
  reviewRouter,
  activityRouter,
  collectionRouter
};
