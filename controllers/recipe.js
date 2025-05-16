const { Activity, sequelize } = require('../models');
const Recipe = require('../models/Recipe');

const createRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const newRecipe = await Recipe.create({ ...req.body, user_id: req.user.id }, { transaction: t });

    await Activity.create({
      user_id: req.user.id,
      type: 'new_recipe',
      target_id: newRecipe.id,
    }, { transaction: t });

    await t.commit();
    res.status(201).json(newRecipe);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to create recipe' });
  }
};



const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe' });
  }
};

const updateRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.update(req.body, { transaction: t });

    await Activity.create({
      user_id: req.user.id,
      type: 'update_recipe',
      target_id: recipe.id,
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Recipe updated successfully' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to update recipe' });
  }
};

const deleteRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Activity.create({
      user_id: req.user.id,
      type: 'delete_recipe',
      target_id: recipe.id,
    }, { transaction: t });

    await recipe.destroy({ transaction: t });
    await t.commit();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
};


module.exports = { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe };