const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const getProfile = async (req, res) => {
  const { id, name, email, bio, profile_picture } = req.user;
  res.json({ id, name, email, bio, profile_picture });
};

const updateProfile = async (req, res) => {
  const { name, bio, profilePicture } = req.body;
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

module.exports = { register, login, getProfile, updateProfile };
