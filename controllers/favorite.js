const { User, Recipe, Favorite } = require('../models');

// Add a recipe to user's favorites
exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    
    await user.addFavoriteRecipes(recipe);

    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove a recipe from user's favorites
exports.removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    await user.removeFavoriteRecipes(recipe);

    res.json({ message: 'Recipe removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all favorite recipes of logged-in user
exports.getUserFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: Recipe,
        as: 'FavoriteRecipes',
        through: { attributes: [] } 
      }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.FavoriteRecipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
