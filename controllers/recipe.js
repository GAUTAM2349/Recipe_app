const { Op, where, fn, col } = require('sequelize');
const { Activity, sequelize, User } = require('../models');
const Recipe = require('../models/Recipe');

const createRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const newRecipe = await Recipe.create({ ...req.body, user_id: req.user.id }, { transaction: t });

    await Activity.create({
      user_id: req.user.id,
      activity_type: 'new_recipe',
      target_id: newRecipe.id,
    }, { transaction: t });

    await t.commit();
    res.status(201).json(newRecipe);
  } catch (err) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: 'Failed to create recipe' });
  }
};



// const getAllRecipes = async (req, res) => {
//   try {
//     const { search } = req.query;

//     let whereClause = {};

//     if (search) {
//       whereClause = {
//         [Op.or]: [
//           { title: { [Op.iLike]: `%${search}%` } },
//           // Only if ingredients and tags are strings:
//           // { ingredients: { [Op.iLike]: `%${search}%` } },
//           // { tags: { [Op.iLike]: `%${search}%` } },

//           // If ingredients and tags are arrays, use raw SQL to match:
//           where(fn("array_to_string", col("ingredients"), ","), {
//             [Op.iLike]: `%${search}%`,
//           }),
//           where(fn("array_to_string", col("dietary_tags"), ","), {
//             [Op.iLike]: `%${search}%`,
//           }),
//         ],
//       };
//     }

//     const recipes = await Recipe.findAll({
//       where: whereClause,
//       include: {
//         model: User,
//         attributes: ['id', 'name', 'profile_picture'],
//       },
//     });

//     res.json(recipes);
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
//   }
// };

// const getAllRecipes = async (req, res) => {
//   try {
//     const { search, page = 1, limit = 10 } = req.query;

//     const offset = (page - 1) * limit;

//     let whereClause = {};

//     if (search) {
//       whereClause = {
//         [Op.or]: [
//           { title: { [Op.iLike]: `%${search}%` } },
//           where(fn("array_to_string", col("ingredients"), ","), {
//             [Op.iLike]: `%${search}%`,
//           }),
//           where(fn("array_to_string", col("dietary_tags"), ","), {
//             [Op.iLike]: `%${search}%`,
//           }),
//         ],
//       };
//     }

//     const recipes = await Recipe.findAll({
//       where: whereClause,
//       include: {
//         model: User,
//         attributes: ['id', 'name', 'profile_picture'],
//       },
//       limit: parseInt(limit),     // how many per page
//       offset: parseInt(offset),   // where to start
//       order: [['created_at', 'DESC']],
//     });

//     res.json(recipes);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
//   }
// };
const getAllRecipes = async (req, res) => {
  const { search, category, difficulty, dietary, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      where(fn("array_to_string", col("ingredients"), ","), {
        [Op.iLike]: `%${search}%`,
      }),
      where(fn("array_to_string", col("dietary_tags"), ","), {
        [Op.iLike]: `%${search}%`,
      }),
    ];
  }

  if (category) whereClause.category = category;
  if (difficulty) whereClause.difficulty = difficulty;
  if (dietary) whereClause.dietary_tags = { [Op.contains]: [dietary] };

  const { count, rows } = await Recipe.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
    include: { model: User, attributes: ["id", "name", "profile_picture"] }
  });

  res.json({ recipes: rows, totalPages: Math.ceil(count / limit) });
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