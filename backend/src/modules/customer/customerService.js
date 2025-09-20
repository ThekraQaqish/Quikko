const customerModel = require("./customerModel");

/**
 * =========================
 * Customer Service Layer
 * =========================
 * Handles business logic for customer-related operations such as carts and cart items.
 */

/**
 * Get all carts
 * @returns {Promise<Array>} Array of all carts
 */
exports.getAllCarts = async () => await customerModel.getAllCarts();

/**
 * Get a specific cart by ID
 * @param {number} id - Cart ID
 * @returns {Promise<Object|null>} Cart object or null if not found
 */
exports.getCartById = async (id) => await customerModel.getCartById(id);

/**
 * Create a new cart for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Newly created cart object
 */
exports.createCart = async (userId) => await customerModel.createCart(userId);

/**
 * Update an existing cart
 * @param {number} id - Cart ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Updated cart object or null if not found
 */
exports.updateCart = async (id, userId) => await customerModel.updateCart(id, userId);

/**
 * Delete a cart by ID
 * @param {number} id - Cart ID
 * @returns {Promise<Object|null>} Deleted cart object or null if not found
 */
exports.deleteCart = async (id) => await customerModel.deleteCart(id);

/**
 * Add an item to a cart
 * @param {number} cartId - Cart ID
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string} [variant] - Optional product variant
 * @returns {Promise<Object>} Newly added item object
 */
exports.addItem = async (cartId, productId, quantity, variant) =>
  await customerModel.addItem(cartId, productId, quantity, variant);

/**
 * Update an item in a cart
 * @param {number} id - Item ID
 * @param {number} quantity - New quantity
 * @param {string} [variant] - Optional new variant
 * @returns {Promise<Object|null>} Updated item object or null if not found
 */
exports.updateItem = async (id, quantity, variant) =>
  await customerModel.updateItem(id, quantity, variant);

/**
 * Delete an item from a cart
 * @param {number} id - Item ID
 * @returns {Promise<Object|null>} Deleted item object or null if not found
 */
exports.deleteItem = async (id) => await customerModel.deleteItem(id);
