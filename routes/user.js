const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');

const {
  getProfile,
  updateProfile,
  userLoginStatus
} = require('../controllers/user');



// Protected routes
router.get('/profile', usersOnly, getProfile);
router.put('/profile', usersOnly, updateProfile);
router.get('/login-status',usersOnly,userLoginStatus);

module.exports = router;
