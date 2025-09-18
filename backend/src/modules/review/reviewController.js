const reviewModel = require('./reviewModel');

const addReview = async (req, res) => {
  try {
    const { vendor_id, rating } = req.body;
    const user_id = req.user.id; // assuming middleware for JWT auth
    const review = await reviewModel.addReview({ user_id, vendor_id, rating });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding review');
  }
};

module.exports = { addReview };
