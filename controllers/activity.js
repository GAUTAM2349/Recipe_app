const { Activity, User, Follow, Recipe } = require('../models');
const { Op } = require('sequelize');

exports.getActivityFeed = async (req, res) => {
  console.log("came for activity")
  try {
    const userId = req.user.id;

    
    const followees = await Follow.findAll({
      where: { follower_id: userId },
      attributes: ['followee_id'],
    });

    const followeeIds = followees.map(f => f.followee_id);

    if (followeeIds.length === 0) {
      return res.json([]); 
    }

    
    const activities = await Activity.findAll({
      where: {
        user_id: {
          [Op.in]: followeeIds,
        },
      },
      order: [['created_at', 'DESC']],
      limit: 50,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profile_picture'],
          where : {isBanned : false}
        },
        
      ],
    });
    
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch activity feed' });
  }
};
