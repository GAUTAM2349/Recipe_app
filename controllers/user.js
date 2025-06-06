const { User } = require("../models");
const uploadToS3 = require("../utils/s3Upload");

const getProfile = async (req, res) => {
  const { id, name, email, bio, profile_picture } = req.user;
  res.json({ id, name, email, bio, profile_picture });
};

const updateProfile = async (req, res) => {
  const { name, bio } = req.body;
  const file = req.file;

  try {
    let profilePicUrl = req.user.profile_picture;

    if (file) {
      const fileName = `profile_pictures/${Date.now()}_${file.originalname}`;
      profilePicUrl = await uploadToS3(file.buffer, fileName);
    }

    req.user.name = name ?? req.user.name;
    req.user.bio = bio ?? req.user.bio;
    req.user.profile_picture = profilePicUrl;
    await req.user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Profile update failed", error: err.message });
  }
};

const updateUserRole = async (req, res) => {
  const owner = req.user;
  if (owner.role != "owner")
    return res.status(403).json({ message: "unauthorized" });

  const { role, userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "no such user found" });

    user.role = role;
    await user.save();

    return res.status(200).json({ success: true });
  } catch (error) {}
};

const userLoginStatus = (req, res) => {
  return res.status(200).json({ message: "user is loggedin", user: req.user });
};

const checkUserRole = (req, res) => {
  return res.status(200).json({ role: req.user.role });
};

module.exports = {
  getProfile,
  updateProfile,
  userLoginStatus,
  updateUserRole,
  checkUserRole,
};
