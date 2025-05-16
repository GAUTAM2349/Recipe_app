const express = require('express');
const router = express.Router();
const auth = require('../middlewares/usersOnly');
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} = require('../controllers/favorite');


router.post('/', auth, addFavorite);


router.delete('/:recipeId', auth, removeFavorite);


router.get('/', auth, getUserFavorites);



module.exports = router;
