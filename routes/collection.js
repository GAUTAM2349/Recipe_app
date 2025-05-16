const express = require('express');
const router = express.Router();
const { createCollection, getMyCollections, addRecipesToCollection, deleteCollection, getRecipesInCollection} = require('../controllers/collection');
const authenticate = require('../middlewares/usersOnly'); // Assuming auth middleware

router.post('/', authenticate, createCollection);
router.get('/', authenticate, getMyCollections);
router.post('/add-recipe', authenticate, addRecipesToCollection);
router.delete('/:collectionId', authenticate, deleteCollection);
router.get('/get-collection-recipes/:collectionId',authenticate, getRecipesInCollection)

module.exports = router;
