const { Collection, Recipe, CollectionRecipe } = require("../models");

// Create a collection
exports.createCollection = async (req, res) => {
  const { name, description, recipeIds } = req.body;

  try {
    const collection = await Collection.create({
      name,
      description,
      user_id: req.user.id,
    });

    if (recipeIds?.length) {
      await collection.setRecipes(recipeIds); // Automatically adds to junction table
    }

    res.status(201).json(collection);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create collection", error: error.message });
  }
};

// Get all collections of a user
exports.getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { user_id: req.user.id },
      include: {
        model: Recipe,
        attributes: ["id", "title", "image_url"],
        through: { attributes: [] },
      },
    });

    res.json(collections);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch collections", error: error.message });
  }
};

// Add recipes to a collection
// exports.addRecipesToCollection = async (req, res) => {

//   const { collectionId, recipeIds } = req.body;

//   try {
//     const collection = await Collection.findOne({
//       where: { id: collectionId, user_id: req.user.id }
//     });

//     if (!collection) {
//       return res.status(404).json({ message: "Collection not found" });
//     }

//     await collection.addRecipes(recipeIds);

//     res.json({ message: "Recipes added to collection" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add recipes", error: error.message });
//   }
// };

exports.addRecipeToCollections = async (req, res) => {
  const { recipeId, collectionId } = req.body;

  if (!recipeId || !collectionId) {
    return res.status(400).json({ message: "please provide complete details.." });
  }

  try {
    const collection = await Collection.findOne({
      where: {
        id: collectionId,
        user_id: req.user.id,
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "No matching collection found" });
    }

    const existingRecipes = await collection.getRecipes({ where: { id: recipeId } });

    if (existingRecipes.length > 0) {
      return res.status(409).json({ message: "recipe already exist in this collection" });
    }

    await collection.addRecipe(recipeId);

    res.json({ message: "Recipe added to selected collection" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add recipe", error: error.message });
  }
};


// Delete a collection
exports.deleteCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findOne({
      where: { id: collectionId, user_id: req.user.id },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    await collection.destroy();
    res.json({ message: "Collection deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete collection", error: error.message });
  }
};

// Get all recipes in a specific collection

exports.getRecipesInCollection = async (req, res) => {
  const collectionId = req.params.collectionId;

  try {
    const links = await CollectionRecipe.findAll({
      where: { collection_id: collectionId },
      attributes: ["recipe_id"],
    });

    const recipeIds = links.map((link) => link.recipe_id);

    if (recipeIds.length === 0) {
      return res.json([]);
    }

    // Fetch full recipe data using those IDs
    const recipes = await Recipe.findAll({
      where: { id: recipeIds },
      attributes: ["id", "title", "image_url"],
    });

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipes in collection" });
  }
};
