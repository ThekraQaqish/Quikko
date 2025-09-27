const DeliveryModel = require('./deliveryModel');

/**
 * @module DeliveryService
 * @desc Business logic for delivery companies and orders.
 *       Handles data processing, validation, and merging logic.
 */

/**
 * Get delivery company profile
 * @async
 * @param {number} userId
 * @returns {Promise<Object|null>}
 */
exports.getCompanyProfile = async (userId) => {
  return await DeliveryModel.getProfileByUserId(userId);
};

/**
 * Update delivery company profile
 * @async
 * @param {number} userId
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
exports.updateCompanyProfile = async (userId, data) => {
  return await DeliveryModel.updateProfileByUserId(userId, data);
};

/**
 * Get order details with company info
 * @async
 * @param {number} orderId
 * @returns {Promise<Object|null>}
 */
exports.getOrderDetails = async (orderId) => {
  return await DeliveryModel.getOrderWithCompany(orderId);
};

/**
 * Update order status
 * @async
 * @param {number} orderId
 * @param {string} status
 * @returns {Promise<Object|null>}
 */
exports.updateOrderStatus = async (orderId, status) => {
  return await DeliveryModel.updateStatus(orderId, status);
};

/**
 * Add new coverage areas to a company
 * @async
 * @param {number} userId
 * @param {Array<string>} newAreas
 * @returns {Promise<Object|null>} Updated company info or null
 */
exports.addCoverageAreas = async (userId, newAreas) => {
  const company = await DeliveryModel.getCoverageById(userId);
  if (!company) return null;

  const currentAreas = company.coverage_areas || [];
  const mergedAreas = Array.from(new Set([...currentAreas, ...newAreas]));

  return await DeliveryModel.addCoverage(userId, mergedAreas);
};


/**
 * Update coverage area
 * @async
 * @param {number} id
 * @param {number} user_id
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
exports.updateCoverageArea = async (id, user_id, data) => {
  return await DeliveryModel.updateCoverage(id, user_id, data);
};

/**
 * Delete coverage area
 * @async
 * @param {number} id
 * @param {number} user_id
 * @returns {Promise<void>}
 */
exports.deleteCoverageArea = async (userId, areasToRemove) => {
  return await DeliveryModel.deleteCoverageAreas(userId, areasToRemove);
};
/**
 * Get coverage areas for company by userId
 * @async
 * @param {number} userId
 * @returns {Promise<Object|null>}
 */
exports.getCoverageAreas = async (userId) => {
  return await DeliveryModel.getCoverageById(userId);
};

/**
 * Get all orders for a delivery company
 * @async
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} List of orders
 */
exports.getCompanyOrders = async (companyId) => {
  return await DeliveryModel.getOrdersByCompanyId(companyId);
};