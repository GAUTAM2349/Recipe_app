const express = require('express');
const router = express.Router();
const usersOnly = require('../middlewares/usersOnly');

const {
  getProfile,
  updateProfile
} = require('../controllers/user');



// Protected routes
router.get('/profile', usersOnly, getProfile);
router.put('/profile', usersOnly, updateProfile);

module.exports = router;
