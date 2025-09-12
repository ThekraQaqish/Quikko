const pool = require('../../config/db');

const getAllVendors = async () => {
  const result = await pool.query('SELECT * FROM vendors');
  return result.rows;
};

module.exports = { getAllVendors };
