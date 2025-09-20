const pool = require("../../config/db");

/**
 * ============================
 * Customer Model - User Module
 * ============================
 */

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
exports.findById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0];
};

/**
 * Update user profile by ID
 * @param {number} id - User ID
 * @param {string} name - User name
 * @param {string} phone - User phone
 * @param {string} address - User address
 * @returns {Promise<Object>} Updated user object
 */
exports.updateById = async (id, name, phone, address) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, phone=$2, address=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
    [name, phone, address, id]
  );
  return result.rows[0];
};

/**
 * Get store details by store ID including products
 * @param {number} storeId - Store ID
 * @returns {Promise<Object|null>} Store object with products array
 */
exports.getStoreById = async function (storeId) {
  const result = await pool.query(
    `SELECT 
       v.id AS store_id,
       v.store_name,
       v.store_slug,
       v.store_logo,
       v.store_banner,
       v.description,
       v.contact_email,
       v.phone,
       v.social_links,
       v.rating,
       v.created_at,
       v.updated_at,
       json_agg(
         json_build_object(
           'product_id', p.id,
           'name', p.name,
           'description', p.description,
           'price', p.price,
           'stock_quantity', p.stock_quantity,
           'images', p.images,
           'variants', p.variants
         )
       ) AS products
     FROM vendors v
     LEFT JOIN products p ON p.vendor_id = v.id
     WHERE v.id = $1
     GROUP BY v.id`,
    [storeId]
  );
  return result.rows[0];
};

/**
 * Place order from cart (Cash on Delivery)
 * @param {number} userId - Customer ID
 * @param {number} cartId - Cart ID
 * @param {Object} addressData - Address details {address_line1, address_line2, city, state, postal_code, country}
 * @returns {Promise<Object>} Created order object
 */
exports.placeOrderFromCart = async function (userId, cartId, addressData) {
  try {
    // 1. Fetch cart items
    const cartItemsResult = await pool.query(
      `SELECT ci.product_id, ci.quantity, ci.variant, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.cart_id = $1 AND c.user_id = $2`,
      [cartId, userId]
    );

    if (cartItemsResult.rows.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    // 2. Insert address
    const addressResult = await pool.query(
      `INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        addressData.address_line1,
        addressData.address_line2 || "",
        addressData.city,
        addressData.state || "",
        addressData.postal_code || "",
        addressData.country || "Jordan",
      ]
    );

    const address = addressResult.rows[0];

    // 3. Find delivery company covering the city
    const deliveryResult = await pool.query(
      `SELECT id FROM delivery_companies
       WHERE $1 = ANY(coverage_areas)
       LIMIT 1`,
      [address.city]
    );

    if (deliveryResult.rows.length === 0) {
      throw new Error(`No delivery company covers ${address.city}`);
    }

    const deliveryCompanyId = deliveryResult.rows[0].id;

    // 4. Calculate total amount
    let total_amount = 0;
    for (let item of cartItemsResult.rows) {
      total_amount += item.price * item.quantity;
    }

    // 5. Insert order
    const orderResult = await pool.query(
      `INSERT INTO orders (customer_id, delivery_company_id, status, shipping_address, total_amount, payment_status, created_at, updated_at)
       VALUES ($1, $2, 'pending', $3, $4, 'unpaid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, deliveryCompanyId, address.address_line1, total_amount]
    );

    const order = orderResult.rows[0];

    // 6. Insert order items
    for (let item of cartItemsResult.rows) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, variant)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
          JSON.stringify(item.variant || {}),
        ]
      );
    }

    return order;
  } catch (err) {
    throw err;
  }
};

/**
 * Get order details for a specific customer
 * @param {number} customerId
 * @param {number} orderId
 * @returns {Promise<Object|null>} Order object with items
 */
exports.getOrderById = async function (customerId, orderId) {
  const result = await pool.query(
    `SELECT 
      o.id AS order_id,
      o.total_amount,
      o.payment_status,
      o.shipping_address,
      o.created_at,
      o.updated_at,
      json_agg(
        json_build_object(
          'order_item_id', oi.id,
          'product_id', p.id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price', oi.price,
          'variant', oi.variant
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE o.id = $1 AND o.customer_id = $2
    GROUP BY o.id`,
    [orderId, customerId]
  );

  return result.rows[0];
};

/**
 * Track order status for a customer
 * @param {number} orderId
 * @param {number} customerId
 * @returns {Promise<Object|null>} Order status object
 */
exports.trackOrder = async function (orderId, customerId) {
  const result = await pool.query(
    `SELECT 
      o.id AS order_id,
      o.status,
      o.updated_at
    FROM orders o
    WHERE o.id = $1 AND o.customer_id = $2`,
    [orderId, customerId]
  );

  return result.rows[0];
};

/**
 * ============================
 * Customer Module - Carts
 * ============================
 */

/**
 * Get all carts
 * @returns {Promise<Array>} Array of cart objects
 */
exports.getAllCarts = async () => {
  const result = await pool.query("SELECT * FROM carts ORDER BY created_at DESC");
  return result.rows;
};

/**
 * Get a cart by ID with items
 * @param {number} id - Cart ID
 * @returns {Promise<Object|null>} Cart object with items array or null
 */
exports.getCartById = async (id) => {
  const cartRes = await pool.query("SELECT * FROM carts WHERE id = $1", [id]);
  if (cartRes.rows.length === 0) return null;

  const itemsRes = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [id]);
  return { ...cartRes.rows[0], items: itemsRes.rows };
};

/**
 * Create a new cart for a user
 * @param {number} userId
 * @returns {Promise<Object>} Created cart object
 */
exports.createCart = async (userId) => {
  const result = await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  return result.rows[0];
};

/**
 * Update cart owner
 * @param {number} id - Cart ID
 * @param {number} userId - New user ID
 * @returns {Promise<Object>} Updated cart object
 */
exports.updateCart = async (id, userId) => {
  const result = await pool.query(
    "UPDATE carts SET user_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [userId, id]
  );
  return result.rows[0];
};

/**
 * Delete a cart and its items
 * @param {number} id - Cart ID
 * @returns {Promise<Object|null>} Deleted cart object or null
 */
exports.deleteCart = async (id) => {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [id]);
  const result = await pool.query("DELETE FROM carts WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

/**
 * ============================
 * Customer Module - Cart Items
 * ============================
 */

/**
 * Add item to cart
 * @param {number} cartId
 * @param {number} productId
 * @param {number} quantity
 * @param {Object} variant
 * @returns {Promise<Object>} Created cart item
 */
exports.addItem = async (cartId, productId, quantity, variant) => {
  const result = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity, variant)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [cartId, productId, quantity, variant]
  );
  return result.rows[0];
};

/**
 * Update item in cart
 * @param {number} id - Item ID
 * @param {number} quantity
 * @param {Object} variant
 * @returns {Promise<Object>} Updated item
 */
exports.updateItem = async (id, quantity, variant) => {
  const result = await pool.query(
    `UPDATE cart_items 
     SET quantity = $1, variant = $2, updated_at = NOW() 
     WHERE id = $3 RETURNING *`,
    [quantity, variant, id]
  );
  return result.rows[0];
};

/**
 * Delete item from cart
 * @param {number} id - Item ID
 * @returns {Promise<Object|null>} Deleted item or null
 */
exports.deleteItem = async (id) => {
  const result = await pool.query(
    "DELETE FROM cart_items WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

/**
 * ============================
 * Customer Module - Products
 * ============================
 */

/**
 * Get all products with optional filters and pagination
 * @param {Object} filters
 * @param {string|null} filters.search - Search term
 * @param {number|null} filters.categoryId - Category ID
 * @param {number} filters.page - Page number (>=1)
 * @param {number} filters.limit - Number of items per page
 * @returns {Promise<Array>} Array of product objects
 */
exports.getAllProducts = async ({ search, categoryId, page, limit }) => {
  let baseQuery = `
    SELECT 
      p.*, 
      v.store_name
    FROM products p
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE 1=1
  `;
  const values = [];
  let idx = 1;

  if (search) {
    baseQuery += ` AND (p.name ILIKE $${idx} OR v.store_name ILIKE $${idx})`;
    values.push(`%${search}%`);
    idx++;
  }

  if (categoryId) {
    baseQuery += ` AND p.category_id = $${idx}`;
    values.push(categoryId);
    idx++;
  }

  baseQuery += ` ORDER BY p.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
  values.push(limit);
  values.push((page - 1) * limit);

  const { rows } = await pool.query(baseQuery, values);
  return rows;
};

/**
 * @function getCustomerOrders
 * @async
 * @desc Retrieve all orders for a specific customer, including order items with product details.
 * @param {number} customer_id - The ID of the customer whose orders are being fetched.
 * @returns {Promise<Array<Object>>} - Returns an array of order objects. Each order contains:
 *   - id {number} - Order ID
 *   - total_amount {number} - Total order amount
 *   - status {string} - Current order status (pending, processing, delivered, etc.)
 *   - payment_status {string} - Payment status (paid/unpaid)
 *   - shipping_address {string} - Shipping address of the order
 *   - created_at {string} - Timestamp of order creation
 *   - items {Array<Object>} - Array of items in the order, each containing:
 *       - product_id {number} - ID of the product
 *       - name {string} - Product name
 *       - price {number} - Price per unit
 *       - quantity {number} - Quantity ordered
 * 
 * @example
 * [
 *   {
 *     id: 1,
 *     total_amount: 150,
 *     status: "pending",
 *     payment_status: "unpaid",
 *     shipping_address: "Amman, Jordan",
 *     created_at: "2025-09-20T12:00:00Z",
 *     items: [
 *       { product_id: 10, name: "Product A", price: 50, quantity: 2 },
 *       { product_id: 12, name: "Product B", price: 25, quantity: 2 }
 *     ]
 *   }
 * ]
 */
exports.getCustomerOrders = async (customer_id) => {
  const result = await pool.query(
    `SELECT o.id, o.total_amount, o.status, o.payment_status, o.shipping_address, o.created_at,
            json_agg(json_build_object(
              'product_id', p.id,
              'name', p.name,
              'price', p.price,
              'quantity', oi.quantity
            )) AS items
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN products p ON oi.product_id = p.id
     WHERE o.customer_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [customer_id]
  );
  return result.rows;
};

