const express = require('express');
const router = express.Router();
const usersOnly = require('../middleware/usersOnly');

const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/user');

// Public routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected routes
router.get('/users/profile', usersOnly, getProfile);
router.put('/users/profile', usersOnly, updateProfile);

module.exports = router;
