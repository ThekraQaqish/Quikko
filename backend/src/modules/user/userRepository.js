const pool = require('../../config/db');
const { generateSlug } = require('../../utils/stringHelpers');


exports.insertUser = async ({ name, email, phone, password_hash, role, address }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role, address, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING *`,
    [name, email, phone, password_hash, role, address]
  );
  return rows[0];
};

exports.insertCustomer = async ({ user_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO customers (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *`,
    [user_id]
  );
  return rows[0];
};

exports.insertVendor = async ({ user_id, store_name, description }) => {
  const store_slug = generateSlug(store_name);

  const { rows } = await pool.query(
    `INSERT INTO vendors (user_id, store_name, store_slug, description, created_at, updated_at) 
     VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING *`,
    [user_id, store_name, store_slug, description]
  );
  return rows[0];
};

exports.insertDelivery = async ({ user_id, company_name }) => {
  const { rows } = await pool.query(
    `INSERT INTO delivery_companies (user_id, company_name, created_at, updated_at) VALUES ($1,$2,NOW(),NOW()) RETURNING *`,
    [user_id, company_name]
  );
  return rows[0];
};
