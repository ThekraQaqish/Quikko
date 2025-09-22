const customerModel = require("./customerModel");

/**
 * =========================
 * Customer Service Layer
 * =========================
 * Handles business logic for customer-related operations such as carts and cart items.
 */
/**
 * ============================
 * Cart Services
 * ============================
 */

/**
 * Fetch all carts for a registered user.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<Array>} Array of cart objects.
 */
exports.getAllCartsByUser = async (userId) => {
  return await customerModel.getAllCartsByUser(userId);
};

/**
 * Fetch all carts for a guest user.
 * @param {string} guestToken - Unique token identifying the guest.
 * @returns {Promise<Array>} Array of cart objects.
 */
exports.getAllCartsByGuest = async (guestToken) => {
  return await customerModel.getAllCartsByGuest(guestToken);
};

/**
 * Get a specific cart by ID
 * @param {number} id - Cart ID
 * @returns {Promise<Object|null>} Cart object or null
 */
exports.getCartById = async (id) => {
  return await customerModel.getCartById(id);
};
/**
 * Create a new cart for a registered user.
 * @param {number} userId - User ID.
 * @returns {Promise<Object>} Newly created cart object.
 */
exports.createCartForUser = async (userId) => {
  return await customerModel.createCartForUser(userId);
};

/**
 * Create a new cart for a guest user.
 * @param {string} guestToken - Unique guest token.
 * @returns {Promise<Object>} Newly created cart object.
 */
exports.createCartForGuest = async (guestToken) => {
  return await customerModel.createCartForGuest(guestToken);
};

/**
 * Update an existing cart owner.
 * @param {number} id - Cart ID.
 * @param {number} userId - New user ID.
 * @returns {Promise<Object|null>} Updated cart object or null if not found.
 */
exports.updateCart = async (id, userId) => {
  return await customerModel.updateCart(id, userId);
};

/**
 * Delete a cart and all its items.
 * @param {number} id - Cart ID.
 * @returns {Promise<Object|null>} Deleted cart object or null if not found.
 */
exports.deleteCart = async (id) => {
  return await customerModel.deleteCart(id);
};

/**
 * ============================
 * Cart Items Services
 * ============================
 */

/**
 * Get a specific cart item by ID via service
 * @param {number} id - Cart item ID
 * @returns {Promise<Object|null>} Cart item object or null
 */
exports.getItemById = async (id) => {
  return await customerModel.getItemById(id);
};
/**
 * Add an item to a cart.
 * @param {number} cartId - Cart ID.
 * @param {number} productId - Product ID.
 * @param {number} quantity - Quantity of the product.
 * @param {string} [variant] - Optional product variant.
 * @returns {Promise<Object>} Newly added cart item object.
 */
exports.addItem = async (cartId, productId, quantity, variant) => {
  return await customerModel.addItem(cartId, productId, quantity, variant);
};

/**
 * Update an item in a cart.
 * @param {number} id - Cart item ID.
 * @param {number} quantity - New quantity.
 * @param {string} [variant] - Optional new variant.
 * @returns {Promise<Object|null>} Updated item object or null if not found.
 */
exports.updateItem = async (id, quantity, variant) => {
  return await customerModel.updateItem(id, quantity, variant);
};

/**
 * Delete an item from a cart.
 * @param {number} id - Cart item ID.
 * @returns {Promise<Object|null>} Deleted item object or null if not found.
 */
exports.deleteItem = async (id) => {
  return await customerModel.deleteItem(id);
};
