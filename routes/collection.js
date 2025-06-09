const express = require('express');
const router = express.Router();
const { createCollection, getMyCollections, addRecipeToCollections, deleteCollection, getRecipesInCollection, removeRecipeFromCollection} = require('../controllers/collection');
const authenticate = require('../middlewares/usersOnly'); // Assuming auth middleware
const usersOnly = require('../middlewares/usersOnly');

router.post('/', authenticate, createCollection);
router.get('/', authenticate, getMyCollections);
router.post('/add-recipe', authenticate, addRecipeToCollections);
router.delete('/:collectionId', authenticate, deleteCollection);
router.get('/get-collection-recipes/:collectionId',authenticate, getRecipesInCollection);
router.delete('/delete-collection-recipe/:collectionId/:recipeId',usersOnly, removeRecipeFromCollection);

module.exports = router;
