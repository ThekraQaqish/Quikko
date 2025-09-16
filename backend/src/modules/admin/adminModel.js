const pool = require("../../config/db");

async function getAllDeliveryCompanies() {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at
     FROM delivery_companies
     ORDER BY created_at DESC`
  );
  return result.rows;
}

module.exports = {
  getAllDeliveryCompanies,
};
