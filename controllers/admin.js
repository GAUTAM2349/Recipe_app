
/***** Admin - Auth ******* */

const { User, Recipe } = require("../models");

const isUserAdmin = (req, res) => {
  return res.status(200).json({ message: "user is admin", user : req.user }); // admin only middleware applied in router
};

/***** Admin - User ******** */

const blockUser = async (req, res) => {

  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) res.status(404).json({ message: "no such user found" });

    user.isBanned = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = false;
    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Failed to unblock user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBlockedUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isBanned: true },
      attributes: ["id", "name", "email", "profile_picture"],
    });

    res.json(users);
  } catch (error) {
    console.error("Failed to get blocked users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*******Admin - Recipe ********** */

const unapprovedRecipes = async (req, res) => {

  try {
    const recipes = await Recipe.findAll({
      where: { approval: "pending" },
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
  
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.approval = "approved";
    await recipe.save();

    res.json({ message: "Recipe approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve recipe" });
  }
};

const disapproveRecipe = async (req, res) => {

  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.approval = "banned";
    await recipe.save();

    res.json({ message: "Recipe banned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to disapprove recipe" });
  }

};


module.exports = {
    isUserAdmin,
    blockUser,
    unblockUser,
    getBlockedUsers,
    unapprovedRecipes,
    approveRecipe,
    disapproveRecipe
}