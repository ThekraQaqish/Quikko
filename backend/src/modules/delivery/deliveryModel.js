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


async function getOrdersByCompanyId(companyId) {
  const result = await pool.query(
    `SELECT id, customer_id, total_amount, status, payment_status, shipping_address, created_at, updated_at
     FROM orders
     WHERE delivery_company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows;
}

async function updateCoverageByCompanyId(companyId, newAreas) {
  // newAreas: مصفوفة جديدة ["Amman", "Irbid"]
  // أولاً نجيب الـ current coverage
  const result = await pool.query(
    `SELECT coverage_areas
     FROM delivery_companies
     WHERE id = $1`,
    [companyId]
  );

  if (result.rows.length === 0) return null;

  const currentAreas = result.rows[0].coverage_areas?.areas || [];

  // دمج المناطق الجديدة بدون تكرار
  const mergedAreas = Array.from(new Set([...currentAreas, ...newAreas]));

  // تحديث الـ coverage_areas
  const updateResult = await pool.query(
    `UPDATE delivery_companies
     SET coverage_areas = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at`,
    [{ areas: mergedAreas }, companyId]
  );

  return updateResult.rows[0];
}


module.exports = {
updateStatus, //for PUT api/delivery/orders/:id
  getOrderById, //for GET api/delivery/tracking/:orderid
  getCoverageById, //for GET api/delivery/coverage/:companyid
  getProfileByCompanyId, //for GET api/delivery/profile/:companyid
  updateProfileByCompanyId, //for PUT api/delivery/profile/:companyid
  getOrdersByCompanyId, //for GET api/delivery/orders/:companyud
  updateCoverageByCompanyId, // for put api/delivery/coverage/:companyid
};

