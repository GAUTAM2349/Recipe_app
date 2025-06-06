const express = require('express');
const router = express.Router();
const { getActivityFeed } = require('../controllers/activity');
const usersOnly = require('../middlewares/usersOnly');

router.get('/', usersOnly, getActivityFeed);

module.exports = router;
