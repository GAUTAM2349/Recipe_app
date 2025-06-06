// routes/recipe.js
const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
} = require('../controllers/recipe');
const upload = require('../middlewares/multer');

// Public Routes
router.get('/', getAllRecipes);
router.get('/user-recipes', usersOnly, getMyRecipes)
router.get('/:id', getRecipeById);

// Protected Routes (require login)

router.post('/', usersOnly, upload.single("image_url") , createRecipe);
router.put('/:id', usersOnly, upload.single("image_url") ,updateRecipe);
router.delete('/:id', usersOnly, deleteRecipe);

module.exports = router;
