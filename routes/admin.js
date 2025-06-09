const express = require('express');
const { unapprovedRecipes, approveRecipe, disapproveRecipe, blockUser, unblockUser, getBlockedUsers, isUserAdmin, getAllUsers, getRecipeById } = require('../controllers/admin');
const adminOnly = require('../middlewares/adminsOnly');
const router = express.Router();

router.get('/auth', adminOnly, isUserAdmin);
router.get('/unapproved-recipes',adminOnly, unapprovedRecipes);
router.put('/approve-recipe/:id',adminOnly, approveRecipe);
router.put('/ban-recipe/:id', adminOnly, disapproveRecipe);
router.put('/block-user/:id',adminOnly, blockUser);
router.put('/unblock-user/:id',adminOnly,unblockUser);
router.get('/blocked-users',adminOnly,getBlockedUsers);
router.get('/all-users',adminOnly,getAllUsers);

module.exports = router;