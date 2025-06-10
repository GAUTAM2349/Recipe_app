const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} = require('../controllers/favorite');


router.post('/', usersOnly, addFavorite);


router.delete('/:recipeId', usersOnly, removeFavorite);


router.get('/', usersOnly, getUserFavorites);



module.exports = router;
