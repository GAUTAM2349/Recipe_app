const Follow = require('../models/Follow');
const User = require('../models/User');

// Follow a user
exports.followUser = async (req, res) => {
  const followerId = req.user.id;
  const { id:followeeId } = req.params;
  console.log( "follow "+followeeId+"  "+followerId);

  if (followerId == followeeId) {
    console.log("detected same users")
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    
    const existingFollow = await Follow.findOne({
      where: { follower_id: followerId, followee_id: followeeId }
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    
    await Follow.create({ follower_id: followerId, followee_id: followeeId });
    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to follow user", error: error.message });
  }
};


exports.unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const { followeeId } = req.body;

  try {

    if( followerId == followeeId ){
      return res.status(400).json({ message: "invalid request" });
    }
    
    const follow = await Follow.findOne({
      where: { follower_id: followerId, followee_id: followeeId }
    });

    if (!follow) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    await follow.destroy();
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow user", error: error.message });
  }
};


exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: User,
        as: 'Following',
        attributes: ['id', 'name', 'email', 'profile_picture'],
        through: { attributes: [] } // Exclude Follow table data
      }
    });

    return res.json(user.Following);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch following list", error: error.message });
  }
};


exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'email', 'profile_picture'],
        through: { attributes: [] }
      }
    });

    return res.json(user.Followers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch followers list", error: error.message });
  }
};

