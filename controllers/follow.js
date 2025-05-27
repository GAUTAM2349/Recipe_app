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
      attributes: ['id', 'name', 'profile_picture'] // include fields you want
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


// exports.getFollowing = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       include: {
//         model: User,
//         as: 'Following',
//         attributes: ['id', 'name', 'profile_picture'],
//         through: { attributes: [] } // Exclude Follow table data
//       }
//     });

//     return res.json(user.Following);
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to fetch following list", error: error.message });
//   }
// };

exports.getFollowing = async (req, res) => {
  try {
    // Fetch the authenticated user instance
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use magic method to get users the current user is following
    const following = await user.getFollowing({
      attributes: ['id', 'name', 'profile_picture'],
      joinTableAttributes: [] // Exclude Follow table attributes
    });

    return res.json(following);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch following list", error: error.message });
  }
};



// exports.getFollowers = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       include: {
//         model: User,
//         as: 'Followers',
//         attributes: ['id', 'name', 'email', 'profile_picture'],
//         through: { attributes: [] }
//       }
//     });

//     return res.json(user.Followers);
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to fetch followers list", error: error.message });
//   }
// };

exports.getFollowers = async (req, res) => {
  try {
    // Fetch the authenticated user instance
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use magic method to get users who follow the current user
    const followers = await user.getFollowers({
      attributes: ['id', 'name', 'email', 'profile_picture'],
      joinTableAttributes: [] // Exclude Follow table attributes
    });

    return res.json(followers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch followers list", error: error.message });
  }
};

