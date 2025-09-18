const pool = require('../../config/db');

const addReview = async ({ user_id, vendor_id, rating }) => {
  const result = await pool.query(
    `INSERT INTO stars_review (user_id, vendor_id, rating, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
    [user_id, vendor_id, rating]
  );
  return result.rows[0];
};

module.exports = { addReview };
