/**
 * ===============================
 * Vendor Service
 * ===============================
 * @module VendorService
 * @desc Business logic for vendor operations such as profile, orders, products, and reports.
 */

const vendorModel = require("./vendorModel");

/**
 * Fetch all vendors.
 *
 * @async
 * @function getAllVendors
 * @returns {Promise<Array<Object>>} Array of vendor records
 *
 * @throws {Error} Database query failure
 */
exports.getAllVendors = async () => {
  return await vendorModel.getAllVendors();
};

/**
 * Fetch vendor report by user ID.
 *
 * Includes total orders and total sales.
 *
 * @async
 * @function getVendorReport
 * @param {number} userId - ID of the user (from JWT)
 * @returns {Promise<Object>} Vendor report object
 *
 * @throws {Error} If vendor not found or DB query fails
 */
exports.getVendorReport = async (userId) => {
  const report = await vendorModel.getVendorReport(userId);
  if (!report) {
    throw new Error("Vendor not found or no orders yet");
  }
  return report;
};

/**
 * Get all orders for a vendor by user ID.
 *
 * - Finds vendor ID via user ID.
 * - Fetches orders linked to that vendor.
 *
 * @async
 * @function getVendorOrders
 * @param {number} userId - ID of the vendor's user
 * @returns {Promise<Array<Object>>} Array of orders
 *
 * @throws {Error} If vendor not found or DB query fails
 */
exports.getVendorOrders = async (userId) => {
  const vendor = await vendorModel.getVendorIdByUserId(userId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }
  return await vendorModel.getVendorOrders(vendor.id);
};

/**
 * Update status of a specific order.
 *
 * @async
 * @function updateOrderStatus
 * @param {number} orderId - ID of the order
 * @param {string} status - New status (e.g., 'pending', 'shipped')
 * @returns {Promise<Object>} Updated order object
 *
 * @throws {Error} If DB update fails
 */
exports.updateOrderStatus = async (orderId, status) => {
  return await vendorModel.updateOrderStatus(orderId, status);
};

/**
 * Get all products for a vendor by user ID.
 *
 * @async
 * @function getVendorProducts
 * @param {number} userId - Vendor's user ID
 * @returns {Promise<Array<Object>>} Array of product objects
 *
 * @throws {Error} If vendor not found or DB query fails
 */
exports.getVendorProducts = async (userId) => {
  const vendor = await vendorModel.getVendorByUserId(userId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }
  return await vendorModel.getVendorProducts(vendor.id);
};

/**
 * Get vendor profile by user ID.
 *
 * @async
 * @function getProfile
 * @param {number} userId - Vendor's user ID
 * @returns {Promise<Object>} Vendor profile object
 *
 * @throws {Error} If DB query fails
 */
exports.getProfile = async (userId) => {
  return await vendorModel.getProfile(userId);
};

/**
 * Update vendor profile.
 *
 * @async
 * @function updateProfile
 * @param {number} userId - Vendor's user ID
 * @param {Object} profileData - Profile fields to update
 * @returns {Promise<Object>} Updated vendor profile
 *
 * @throws {Error} If DB update fails
 */
exports.updateProfile = async (userId, profileData) => {
  return await vendorModel.updateProfile(userId, profileData);
};
