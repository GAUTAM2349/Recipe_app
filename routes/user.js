const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');

const {
  getProfile,
  updateProfile,
  userLoginStatus,
  blockUser,
  unblockUser,
  getBlockedUsers
} = require('../controllers/user');
const upload = require('../middlewares/multer');



// Protected routes
router.get('/profile', usersOnly, getProfile);
router.put('/profile', usersOnly, upload.single("profilePicture") ,updateProfile);
router.get('/login-status',usersOnly,userLoginStatus);
router.put('/block/:id',usersOnly, blockUser) // admin only
router.put('/unblock/:id',usersOnly,unblockUser) // admin only
router.get('/blocked-users',usersOnly,getBlockedUsers) //admin only

module.exports = router;
