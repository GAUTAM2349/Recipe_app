const { User } = require('../models');

const getProfile = async (req, res) => {
  const { id, name, email, bio, profile_picture } = req.user;
  res.json({ id, name, email, bio, profile_picture });
};

const updateProfile = async (req, res) => {
  const { name, bio, profilePicture } = req.body;
  console.log("\n\n got name, bio, profilPic", name,bio,profilePicture)
  try {
    req.user.name = name ?? req.user.name;
    req.user.bio = bio ?? req.user.bio;
    req.user.profile_picture = profilePicture ?? req.user.profile_picture;
    await req.user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

const userLoginStatus = (req, res) => {
  return res.status(200).json({ message: "user is loggedin", user: req.user });
};

module.exports = { getProfile, updateProfile, userLoginStatus };