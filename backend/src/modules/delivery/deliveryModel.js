const pool = require("../../config/db");

// Get order joined with delivery company
// Get order joined with delivery company
async function getOrderWithCompany(orderId) {
  const result = await pool.query(
    `SELECT o.*, dc.id AS company_id, dc.company_name
     FROM orders o
     LEFT JOIN delivery_companies dc ON o.delivery_company_id = dc.id
     WHERE o.id = $1`,
    [orderId]
  );
  return result.rows[0];
}
async function updateStatus(id, status) {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

//tracking info for the order
async function getOrderById(orderId) {
  const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
    orderId,
  ]);
  return result.rows[0];
}

//get coverage area for specific company
async function getCoverageById(companyId) {
  const result = await pool.query(
    `SELECT id AS company_id, company_name, coverage_areas 
     FROM delivery_companies 
     WHERE id = $1`,
    [companyId]
  );
  return result.rows[0];
}


//additional task -- get the profile for the company 
async function getProfileByCompanyId(companyId) {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at
     FROM delivery_companies
     WHERE id = $1`,
    [companyId]
  );
  return result.rows[0];
}


async function updateProfileByCompanyId(companyId, data) {
  const { company_name, coverage_areas } = data;

  const result = await pool.query(
    `UPDATE delivery_companies
     SET company_name = COALESCE($1, company_name),
         coverage_areas = COALESCE($2, coverage_areas),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at`,
    [company_name, coverage_areas, companyId]
  );

  return result.rows[0];
}




module.exports = {
  getOrderWithCompany,
  updateStatus, //for PUT /orders/:id
  getOrderById, //for GET /tracking/:orderid
  getCoverageById, //for GET /coverage/:companyid
  getProfileByCompanyId, //for GET /profile/:companyid
  updateProfileByCompanyId, //for PUT /profile/:companyid
};

// updateProfile,