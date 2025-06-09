const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');

const {
  getProfile,
  updateProfile,
  userLoginStatus,
  publicProfile,
} = require('../controllers/user');
const upload = require('../middlewares/multer');
const adminOnly = require('../middlewares/adminsOnly');



// Protected routes
router.get('/profile', usersOnly, getProfile);
router.get('/public-profile/:userId', publicProfile);
router.put('/profile', usersOnly, upload.single("profilePicture") ,updateProfile);
router.get('/login-status',usersOnly,userLoginStatus);

module.exports = router;
