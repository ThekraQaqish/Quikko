const pool = require('../../config/db');

// تفاصيل منتج حسب ID
const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, v.store_name, c.name AS category_name
     FROM products p
     JOIN vendors v ON p.vendor_id = v.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = { getProductById };
