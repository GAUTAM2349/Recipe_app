const express = require('express');
const router = express.Router();
const auth = require('../middlewares/usersOnly');
const {
  createReview,
  getReviewsByRecipe,
  updateReview,
  deleteReview
} = require('../controllers/review');


router.post('/', auth, createReview);


router.get('/recipe/:recipeId', getReviewsByRecipe);


router.put('/:reviewId', auth, updateReview);


router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
