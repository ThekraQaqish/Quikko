const pool = require("../../config/db");

//additional task -- get the profile for the company
exports.getProfileByUserId = async function (userId) {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at
     FROM delivery_companies
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

exports.updateProfileByUserId = async function (userId, data) {
  const { company_name, coverage_areas } = data;

  const result = await pool.query(
    `UPDATE delivery_companies
     SET company_name = COALESCE($1, company_name),
         coverage_areas = COALESCE($2, coverage_areas),
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3
     RETURNING id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at`,
    [company_name, coverage_areas, userId]
  );

  return result.rows[0];
};
// Get order joined with delivery company
exports.getOrderWithCompany = async function (orderId) {
  const result = await pool.query(
    `SELECT o.*, dc.id AS company_id, dc.company_name
     FROM orders o
     LEFT JOIN delivery_companies dc ON o.delivery_company_id = dc.id
     WHERE o.id = $1`,
    [orderId]
  );
  return result.rows[0];
};

exports.updateStatus = async function (orderId, status) {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, orderId]
  );
  return result.rows[0];
};
//tracking info for the order
exports.getOrderById = async function (orderId) {
  const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
    orderId,
  ]);
  return result.rows[0];
};
exports.getCompanyByUserId = async function (userId) {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name
     FROM delivery_companies
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

exports.getCompany = async function (userId) {
  const result = await pool.query(
    `SELECT id AS company_id FROM delivery_companies WHERE user_id = $1`,
    [userId]
  );
  // استخرج فقط company_id كرقم
  return result.rows[0]?.company_id || null;
};

exports.getOrdersByCompanyId = async function (companyId) {
  const result = await pool.query(
    `SELECT id, customer_id, total_amount, status, payment_status, shipping_address, created_at, updated_at
     FROM orders
     WHERE delivery_company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows;
};

//get coverage area for specific company
exports.getCoverageById = async function (userId) {
  const result = await pool.query(
    `SELECT id AS company_id, company_name, coverage_areas 
     FROM delivery_companies 
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

exports.addCoverage = async function (userId, newAreas) {
  // newAreas: مصفوفة جديدة ["Amman", "Irbid"]
  const result = await pool.query(
    `SELECT id, coverage_areas
     FROM delivery_companies
     WHERE user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) return null;

  const companyId = result.rows[0].id;
  const currentAreas = result.rows[0].coverage_areas?.areas || [];

  const mergedAreas = Array.from(new Set([...currentAreas, ...newAreas]));

  const updateResult = await pool.query(
    `UPDATE delivery_companies
   SET coverage_areas = $1,
       updated_at = CURRENT_TIMESTAMP
   WHERE user_id = $2
   RETURNING id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at`,
    [mergedAreas, userId] // mergedAreas مصفوفة من النصوص
  );

  return updateResult.rows[0];
};

// Update coverage area
exports.updateCoverage = async (id, user_id, coverageAreaData) => {
  const {
    company_name,
    status,
    coverage_areas,
  } = coverageAreaData;

  const query = `
    UPDATE delivery_companies
    SET company_name = $1,
        coverage_areas = $2,
        updated_at = NOW()
    WHERE id = $3 AND user_id = $4
    RETURNING *;
  `;

  const values = [
    company_name,
    status,
    coverage_areas,
    id,
    user_id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete coverage area
exports.deleteCoverage = async (id, user_id) => {
  const query = `DELETE FROM delivery_companies WHERE id = $1 AND user_id = $2 RETURNING *;`;
  await pool.query(query, [id, user_id]);
};