// routes/recipe.js
const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipe');

// Public Routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Protected Routes (require login)

router.post('/', usersOnly, createRecipe);
router.put('/:id', usersOnly, updateRecipe);
router.delete('/:id', usersOnly, deleteRecipe);

module.exports = router;
