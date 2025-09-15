const pool = require('../../config/db');

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
  return result.rows[0];
};

const updateById = async (id, name, phone, address) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, phone=$2, address=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
    [name, phone, address, id]
  );
  return result.rows[0];
};

module.exports = { findById, updateById };
