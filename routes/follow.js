const express = require('express');
const router = express.Router();
const auth = require('../middlewares/usersOnly');
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} = require('../controllers/follow');


router.post('/:id', auth, followUser);


router.delete('/:userId', auth, unfollowUser);


router.get('/followers', auth, getFollowers);

router.get('/following', auth, getFollowing);


module.exports = router;
