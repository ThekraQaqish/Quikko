/**
 * ===============================
 * Review Model
 * ===============================
 * @module ReviewModel
 * @desc Handles database operations for vendor reviews.
 */

const pool = require('../../config/db');

/**
 * Add a new review for a vendor.
 *
 * @async
 * @function addReview
 * @param {Object} params - Review parameters
 * @param {number} params.user_id - ID of the user submitting the review
 * @param {number} params.vendor_id - ID of the vendor being reviewed
 * @param {number} params.rating - Rating value given by the user
 * @returns {Promise<Object>} The newly created review object
 */
exports.addReview = async ({ user_id, vendor_id, rating }) => {
  const result = await pool.query(
    `INSERT INTO stars_review (user_id, vendor_id, rating, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
    [user_id, vendor_id, rating]
  );
  return result.rows[0];
};

/**
 * Get all reviews for a specific vendor.
 *
 * @async
 * @function getReviewsByVendor
 * @param {number} vendor_id - ID of the vendor
 * @returns {Promise<Array>} List of review objects
 */
exports.getReviewsByVendor = async (vendor_id) => {
  const result = await pool.query(
    `SELECT * FROM stars_review WHERE vendor_id = $1 ORDER BY created_at DESC`,
    [vendor_id]
  );
  return result.rows;
};

/**
 * Get the average rating for a specific vendor.
 *
 * @async
 * @function getAverageRating
 * @param {number} vendor_id - ID of the vendor
 * @returns {Promise<number>} Average rating, 0 if no reviews
 */
exports.getAverageRating = async (vendor_id) => {
  const result = await pool.query(
    `SELECT AVG(rating) AS average_rating FROM stars_review WHERE vendor_id = $1`,
    [vendor_id]
  );
  return parseFloat(result.rows[0].average_rating) || 0;
};
