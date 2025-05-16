const express = require('express');
const router = express.Router();
const auth = require('../middlewares/usersOnly');
const { getActivityFeed } = require('../controllers/activity');

router.get('/feed', auth, getActivityFeed);

module.exports = router;
