const { Op, where, fn, col } = require("sequelize");
const { Activity, sequelize, User } = require("../models");
const Recipe = require("../models/Recipe");
const uploadToS3 = require("../utils/s3Upload");

const createRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  try {

    const newRecipe = await Recipe.create(
      { ...req.body, user_id: req.user.id },
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
  const whereClause = { isApproved:true };

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
    include: { model: User, attributes: ["id", "name", "profile_picture"],
      where : {isBanned : false}
     },
  });

  res.json({ recipes: rows, totalPages: Math.ceil(count / limit) });
};

const getRecipeById = async (req, res) => {
 
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch specific `recipe" });
  }
};

const getMyRecipes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    
    const { count, rows } = await Recipe.findAndCountAll({
      where: { user_id: req.user.id, isApproved : true },
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

const updateRecipe = async (req, res) => {
  const t = await sequelize.transaction();
  const file = req.file;
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
    res.status(500).json({ message: "Failed to update recipe", error: err.message });
  }
};




const deleteRecipe = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe || (recipe.user_id !== req.user.id && req.user.role != "admin") ) {
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


const unapprovedRecipes = async (req, res) => {

  console.log("\n\n req user in recipe is ",req.user)
  if( req.user.role != "admin" ) return res.status(403).json({message: "unauthorized"});
  
  try {
    const recipes = await Recipe.findAll({
      where: { isApproved: false },
      order: [["created_at", "DESC"]],
      include: {
        model: User,
        attributes: ["id", "name", "profile_picture"],
        where: { isBanned: false },  
      },
    });

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch unapproved recipes" });
  }
};

const approveRecipe = async (req, res) => {

  if( req.user.role != "admin" ) return res.status(403).json({message: "unauthorized"});
  
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.isApproved = true;
    await recipe.save();

    res.json({ message: "Recipe approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve recipe" });
  }
};


const disapproveRecipe = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });

  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.isApproved = false;
    await recipe.save();

    res.json({ message: "Recipe disapproved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to disapprove recipe" });
  }
};



module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  unapprovedRecipes,
  approveRecipe,
  disapproveRecipe
};

