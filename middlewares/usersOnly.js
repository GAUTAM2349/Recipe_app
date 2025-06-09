const jwt = require('jsonwebtoken');
const { User } = require('../models');

const usersOnly = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    const user = await User.findByPk(decoded.id);
    
    if (!user) return res.status(401).json({ message: 'User not found' });
    if( user.isBanned === true ) return res.status(403).json({ message : "banned"}); // banned user

    req.user = user;
    next();
  } catch (err) {
    console.log("\n\n authentication error ",err)
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = usersOnly;
