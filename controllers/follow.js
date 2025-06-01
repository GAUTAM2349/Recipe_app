const Follow = require('../models/Follow');
const User = require('../models/User');


exports.followUser = async (req, res) => {
  const followerId = req.user.id;
  const { id: followeeId } = req.params;

  console.log("follow " + followeeId + "  " + followerId);

  if (followerId == followeeId) {
    console.log("detected same users");
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

    const followedUser = await User.findByPk(followeeId, {
      attributes: ['id', 'name', 'profile_picture'] 
    });

    res.status(201).json({ 
      message: "Followed successfully",
      followedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to follow user", error: error.message });
  }
};


exports.unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const {userId:followeeId} = req.params

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
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const following = await user.getFollowing({
      attributes: ['id', 'name', 'profile_picture'],
      joinTableAttributes: [],
      where : { isBanned : false }
    });

    return res.json(following);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch following list", error: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followers = await user.getFollowers({
      attributes: ['id', 'name', 'email', 'profile_picture'],
      joinTableAttributes: [], // attributes of junction table (follow table)
      where : { isBanned : false }
    });

    return res.json(followers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch followers list", error: error.message });
  }
};

