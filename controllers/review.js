const { Review, User, Recipe, Activity } = require('../models');

exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { recipeId, rating, comment } = req.body;

  try {
    
    const recipe = await Recipe.findByPk(recipeId); // if recipe exist then only review is allowed
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const existingReview = await Review.findOne({
      where: { user_id: userId, recipe_id: recipeId },
    });

    if (existingReview) {
      console.log("can't create review already exists")
      return res.status(400).json({ message: 'You have already reviewed this recipe' });
    }

    const review = await Review.create({
      user_id: userId,
      recipe_id: recipeId,
      rating,
      comment,
    });

    // acivity created
    await Activity.create({
      user_id: userId,
      activity_type: 'review_recipe',
      target_id: recipeId,
    });
    console.log("review created")
    res.status(201).json(review);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getReviewsByRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { recipe_id: recipeId },
      include: [{ model: User, attributes: ['id', 'name', 'profile_picture'], 
        where : {isBanned: false}
      }],
      order: [['created_at', 'DESC']]
    });
    console.log("sent reviews")
    res.json(reviews);
  } catch (err) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateReview = async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
    console.log("review updated")
    res.json(review);
  } catch (err) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.deleteReview = async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;

  try {
    const review = await Review.findByPk(reviewId);
    // if( review.user_id != userId && )
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
