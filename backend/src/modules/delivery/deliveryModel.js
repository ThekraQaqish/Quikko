const pool = require("../../config/db");

/**
 * @module DeliveryModel
 * @desc Handles direct database operations for delivery companies and orders.
 *       Responsible for executing queries without applying business logic.
 */

/**
 * Get delivery company profile by user ID
 * @async
 * @param {number} userId - Authenticated user's ID
 * @returns {Promise<Object|null>} Company profile or null if not found
 */
exports.getProfileByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at
     FROM delivery_companies
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Update delivery company profile by user ID
 * @async
 * @param {number} userId - User ID
 * @param {Object} data - Data to update
 * @param {string} [data.company_name] - New company name
 * @param {Array<string>} [data.coverage_areas] - Updated coverage areas
 * @returns {Promise<Object|null>} Updated company profile or null if not found
 */
exports.updateProfileByUserId = async (userId, data) => {
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

/**
 * Get order with delivery company info
 * @async
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} Order joined with company info or null
 */
exports.getOrderWithCompany = async (orderId) => {
  const result = await pool.query(
    `SELECT o.*, dc.id AS company_id, dc.company_name
     FROM orders o
     LEFT JOIN delivery_companies dc ON o.delivery_company_id = dc.id
     WHERE o.id = $1`,
    [orderId]
  );
  return result.rows[0];
};

/**
 * Update order status
 * @async
 * @param {number} orderId - Order ID
 * @param {string} status - New order status
 * @returns {Promise<Object|null>} Updated order or null
 */
exports.updateStatus = async (orderId, status) => {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, orderId]
  );
  return result.rows[0];
};

/**
 * Get order by ID
 * @async
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} Order or null
 */
exports.getOrderById = async (orderId) => {
  const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);
  return result.rows[0];
};

/**
 * Get company by user ID
 * @async
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Company info or null
 */
exports.getCompanyByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name
     FROM delivery_companies
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Get company ID by user ID
 * @async
 * @param {number} userId - User ID
 * @returns {Promise<number|null>} Company ID or null
 */
exports.getCompany = async (userId) => {
  const result = await pool.query(
    `SELECT id AS company_id FROM delivery_companies WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0]?.company_id || null;
};

/**
 * Get all orders for a company
 * @async
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} List of orders
 */
exports.getOrdersByCompanyId = async (companyId) => {
  const result = await pool.query(
    `SELECT id, customer_id, total_amount, status, payment_status, shipping_address, created_at, updated_at
     FROM orders
     WHERE delivery_company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows;
};

/**
 * Get coverage by user ID
 * @async
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Company coverage info or null
 */
exports.getCoverageById = async (userId) => {
  const result = await pool.query(
    `SELECT id AS company_id, company_name, coverage_areas 
     FROM delivery_companies 
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Add coverage areas
 * @async
 * @param {number} userId - User ID
 * @param {Array<string>} mergedAreas - Coverage areas to save
 * @returns {Promise<Object|null>} Updated company info or null
 */
exports.addCoverage = async (userId, mergedAreas) => {
  const result = await pool.query(
    `UPDATE delivery_companies
     SET coverage_areas = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2
     RETURNING id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at`,
    [mergedAreas, userId]
  );
  return result.rows[0];
};

/**
 * Update coverage
 * @async
 * @param {number} id - Company ID
 * @param {number} user_id - User ID
 * @param {Object} data - { company_name, coverage_areas }
 * @returns {Promise<Object|null>} Updated company info or null
 */
exports.updateCoverage = async (id, user_id, data) => {
  const { company_name, coverage_areas } = data;
  const query = `
    UPDATE delivery_companies
    SET company_name = $1,
        coverage_areas = $2,
        updated_at = NOW()
    WHERE id = $3 AND user_id = $4
    RETURNING *;
  `;
  const values = [company_name, coverage_areas, id, user_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Delete coverage
 * @async
 * @param {number} id - Company ID
 * @param {number} user_id - User ID
 * @returns {Promise<void>}
 */
exports.deleteCoverage = async (id, user_id) => {
  await pool.query(
    `DELETE FROM delivery_companies WHERE id = $1 AND user_id = $2`,
    [id, user_id]
  );
};
