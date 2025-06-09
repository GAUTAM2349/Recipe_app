const { Op, where, fn, col } = require("sequelize");
const { Activity, sequelize, User } = require("../models");
const Recipe = require("../models/Recipe");
const uploadToS3 = require("../utils/s3Upload");

const createRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  const file = req.file;

  try {
    if (file) {
      const fileName = `recipe_images/${Date.now()}_${file.originalname}`;
      const imageUrl = await uploadToS3(file.buffer, fileName);
      req.body.image_url = imageUrl;
      console.log("\n\nsuccessfully uploaded recipe image to s3 bucket");
    }

    // Parse arrays if they come as JSON strings
    if (typeof req.body.ingredients === "string") {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    if (typeof req.body.dietary_tags === "string") {
      req.body.dietary_tags = JSON.parse(req.body.dietary_tags);
    }

    let approval = "pending";
    if( req.user.role == "admin" ) approval = "approved";

    const newRecipe = await Recipe.create(
      { ...req.body, user_id: req.user.id, approval },
      { transaction: t }
    );

    await Activity.create(
      {
        user_id: req.user.id,
        activity_type: "new_recipe",
        target_id: newRecipe.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(newRecipe);
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ message: "Failed to create recipe" });
  }
};

const getAllRecipes = async (req, res) => {
  const {
    search,
    category,
    difficulty,
    dietary,
    page = 1,
    limit = 10,
  } = req.query;

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

  whereClause.approval = "approved";

  if (category) whereClause.category = category;
  if (difficulty) whereClause.difficulty = difficulty;
  if (dietary) whereClause.dietary_tags = { [Op.contains]: [dietary] };

  const { count, rows } = await Recipe.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
    include: {
      model: User,
      attributes: ["id", "name", "profile_picture"],
      where: { isBanned: false },
    },
  });

  res.json({ recipes: rows, totalPages: Math.ceil(count / limit) });
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if(recipe.approval == 'banned') return res.status(403).json({message:"recipe is banned"});
    res.json(recipe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch specific `recipe" });
  }
};

const getMyRecipes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Recipe.findAndCountAll({
      where: {
        user_id: req.user.id,
        approval: { [Op.in]: ["pending", "approved"] },
      },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.json({
      recipes: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch user's recipes",
      error: err.message,
    });
  }
};


const getPublicRecipesOfUser = async (req, res) => {
  const userId = req.params.id;

  try {

    const user = await User.findByPk(userId);
    if(!user || user.isBanned) return res.status(404).json({message: "user not found"});
    
    const recipes = await Recipe.findAll({
      where: {
        user_id: userId,
        approval: "approved",
      },
      order: [["created_at", "DESC"]],
    });

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch public recipes for this user",
      error: err.message,
    });
  }
};

const updateRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  const file = req.file;
  console.log(req.body);
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    let imageUrl = recipe.image_url;
    if (file) {
      const fileName = `recipe_images/${Date.now()}_${file.originalname}`;
      imageUrl = await uploadToS3(file.buffer, fileName);
      console.log("\n\nsuccessfully uploaded recipe image to s3 bucket");
    }

    // Parse JSON strings to arrays before update
    const updatedData = {
      ...req.body,
      image_url: imageUrl,
    };

    if (typeof updatedData.ingredients === "string") {
      updatedData.ingredients = JSON.parse(updatedData.ingredients);
    }
    if (typeof updatedData.dietary_tags === "string") {
      updatedData.dietary_tags = JSON.parse(updatedData.dietary_tags);
    }

    await recipe.update(updatedData, { transaction: t });

    await Activity.create(
      {
        user_id: req.user.id,
        type: "update_recipe",
        target_id: recipe.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Recipe updated successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res
      .status(500)
      .json({ message: "Failed to update recipe", error: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (
      !recipe ||
      (recipe.user_id !== req.user.id && req.user.role != "admin")
    ) {
      await t.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    // rather than creating a new delete activity, i'm deleting all post associated activity - privacy
    await Activity.destroy({
      where: { target_id: recipe.id },
      transaction: t,
    });

    await recipe.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  getPublicRecipesOfUser
};
