const customerService = require("./customerService");
const customerModel = require("./customerModel");
const { validationResult } = require("express-validator");

/**
 * @module CustomerController
 * @desc Controller handling customer-related endpoints including profile, store details,
 *       orders, carts, cart items, and products.
 */

/**
 * @function getProfile
 * @desc Fetch the profile of the authenticated customer.
 * @route GET /api/customer/profile
 * @access Private
 * @returns {Object} Customer profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const profile = await customerModel.findById(user_id);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching profile");
  }
};

/**
 * @function updateProfile
 * @desc Update the profile of the authenticated customer.
 * @route PUT /api/customer/profile
 * @access Private
 * @body {string} name - Customer name
 * @body {string} phone - Customer phone
 * @body {string} address - Customer address
 * @returns {Object} Updated profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, phone, address } = req.body;
    const updatedProfile = await customerModel.updateById(user_id, name, phone, address);
    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile");
  }
};

/**
 * @function fetchStoreDetails
 * @desc Get details of a specific store by its ID.
 * @route GET /api/customer/store/:storeId
 * @access Public
 * @param {number} storeId - ID of the store
 * @returns {Object} Store details
 */
exports.fetchStoreDetails = async function (req, res) {
  try {
    const { storeId } = req.params;

    if (isNaN(storeId)) {
      return res.status(400).json({ error: "Invalid store ID" });
    }

    const store = await customerModel.getStoreById(storeId);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({
      message: "Store details fetched successfully",
      data: store,
    });
  } catch (err) {
    console.error("Error fetching store details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function postOrderFromCart
 * @desc Place an order from the customer's cart (Cash on Delivery).
 * @route POST /api/customer/orders
 * @access Private
 * @body {number} cart_id - Cart ID
 * @body {Object} address - Address object with address_line1 and city
 * @returns {Object} Order details
 */
exports.postOrderFromCart = async function (req, res) {
  try {
    const userId = req.user.id;
    const { cart_id, address } = req.body;

    if (!cart_id || typeof cart_id !== "number") {
      return res.status(400).json({ error: "cart_id must be a valid number" });
    }

    if (!address || !address.address_line1 || !address.city) {
      return res.status(400).json({
        error: "Address must include at least address_line1 and city",
      });
    }

    const order = await customerModel.placeOrderFromCart(userId, cart_id, address);

    res.status(201).json({
      message: "Order placed successfully (COD)",
      order,
    });
  } catch (err) {
    console.error("Error placing order from cart:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function getOrderDetails
 * @desc Get details of a specific order for the authenticated customer.
 * @route GET /api/customer/orders/:orderId
 * @access Private
 * @param {number} orderId - Order ID
 * @returns {Object} Order details
 */
exports.getOrderDetails = async function (req, res) {
  try {
    const customerId = req.user.id;
    const { orderId } = req.params;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await customerModel.getOrderById(customerId, orderId);

    if (!order) {
      return res.status(403).json({ error: "You do not have access to this order" });
    }

    res.json({
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function trackOrder
 * @desc Track status of a specific order.
 * @route GET /api/customer/orders/:orderId/track
 * @access Private
 * @param {number} orderId - Order ID
 * @returns {Object} Order status
 */
exports.trackOrder = async function (req, res) {
  try {
    const customerId = req.user.id;
    const orderId = req.params.orderId;

    const order = await customerModel.trackOrder(orderId, customerId);

    if (!order) {
      return res.status(404).json({ error: "Order not found or not authorized" });
    }

    res.json({
      message: "Order status fetched successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error tracking order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @function getAllCarts
 * @desc Retrieve all carts for the authenticated customer.
 * @route GET /api/customer/carts
 * @access Private
 * @returns {Array} List of carts
 */
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await customerService.getAllCarts();
    res.json(carts);
  } catch (err) {
    console.error("Error getting carts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function getCartById
 * @desc Retrieve a specific cart by ID.
 * @route GET /api/customer/carts/:id
 * @access Private
 * @param {number} id - Cart ID
 * @returns {Object} Cart details
 */
exports.getCartById = async (req, res) => {
  try {
    const cart = await customerService.getCartById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function createCart
 * @desc Create a new cart for the authenticated customer.
 * @route POST /api/customer/carts
 * @access Private
 * @returns {Object} Created cart
 */
exports.createCart = async (req, res) => {
  try {
    const cart = await customerService.createCart(req.user.id);
    res.status(201).json(cart);
  } catch (err) {
    console.error("Error creating cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function updateCart
 * @desc Update a specific cart by ID.
 * @route PUT /api/customer/carts/:id
 * @access Private
 * @body {number} user_id - Customer ID
 * @returns {Object} Updated cart
 */
exports.updateCart = async (req, res) => {
  try {
    const { user_id } = req.body;
    const cart = await customerService.updateCart(req.params.id, user_id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function deleteCart
 * @desc Delete a specific cart by ID.
 * @route DELETE /api/customer/carts/:id
 * @access Private
 * @returns {Object} Success message
 */
exports.deleteCart = async (req, res) => {
  try {
    const cart = await customerService.deleteCart(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart deleted" });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function addItem
 * @desc Add an item to a cart.
 * @route POST /api/customer/cart-items
 * @access Private
 * @body {number} cart_id
 * @body {number} product_id
 * @body {number} quantity
 * @body {string} [variant]
 * @returns {Object} Added item
 */
exports.addItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity, variant } = req.body;
    const item = await customerService.addItem(cart_id, product_id, quantity, variant);
    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function updateItem
 * @desc Update an item in the cart.
 * @route PUT /api/customer/cart-items/:id
 * @access Private
 * @body {number} quantity
 * @body {string} [variant]
 * @returns {Object} Updated item
 */
exports.updateItem = async (req, res) => {
  try {
    const { quantity, variant } = req.body;
    const item = await customerService.updateItem(req.params.id, quantity, variant);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function deleteItem
 * @desc Delete an item from the cart.
 * @route DELETE /api/customer/cart-items/:id
 * @access Private
 * @returns {Object} Success message
 */
exports.deleteItem = async (req, res) => {
  try {
    const item = await customerService.deleteItem(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function getAllProducts
 * @desc Get all products with optional filters, pagination, and search.
 * @route GET /api/customer/products
 * @access Public
 * @query {string} [search] - Search term
 * @query {number} [categoryId] - Category ID
 * @query {number} [page=1] - Page number
 * @query {number} [limit=10] - Items per page
 * @returns {Object} Products list with pagination info
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 10 } = req.query;

    const filters = {
      search: search || null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await customerModel.getAllProducts(filters);
    return res.json(result);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Error getting products" });
  }
};


/**
 * @function getOrders
 * @async
 * @desc Fetch all orders for the authenticated customer.
 *       Requires a valid JWT token (user info available on req.user).
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object from auth middleware
 * @param {number} req.user.id - ID of the authenticated customer
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of orders or an error message
 * 
 * @example
 * // Response when orders exist
 * [
 *   {
 *     id: 1,
 *     customer_id: 5,
 *     total_amount: 150,
 *     status: "pending",
 *     payment_status: "unpaid",
 *     shipping_address: "Amman, Jordan",
 *     created_at: "2025-09-20T12:00:00Z",
 *     updated_at: "2025-09-20T12:00:00Z",
 *     items: [
 *       { product_id: 10, name: "Product A", quantity: 2, price: 50 }
 *     ]
 *   }
 * ]
 *
 * @example
 * // Response when no orders found
 * { message: "No orders found" }
 */
exports.getOrders  = async (req, res) => {
  try {
    const customer_id = req.user.id; 
    const orders = await orderModel.getCustomerOrders(customer_id);

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};