const pool = require("../../config/db");

exports.getAllVendors = async () => {
  const result = await pool.query("SELECT * FROM vendors");
  return result.rows;
};

exports.getVendorReport= async (userId) => {
  const query = `
    SELECT 
      v.id AS vendor_id,
      v.store_name,
      COUNT(DISTINCT o.id) AS total_orders,
      COALESCE(SUM(oi.quantity * oi.price), 0) AS total_sales
    FROM vendors v
    LEFT JOIN products p ON v.id = p.vendor_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
    WHERE v.user_id = $1
    GROUP BY v.id, v.store_name
    ORDER BY total_sales DESC;
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};


exports.getVendorIdByUserId = async (userId) => {
  const query = `SELECT id FROM vendors WHERE user_id = $1`;
  const { rows } = await pool.query(query, [userId]);
  return rows[0]; 
};

exports.getVendorOrders = async (vendorId) => {
  const query = `
      SELECT
      o.id AS order_id,
      o.status,
      o.total_amount,
      o.shipping_address,
      oi.id AS item_id,       
      oi.quantity,
      oi.price,
      p.name AS product_name,
      p.id AS product_id
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE p.vendor_id = $1
    ORDER BY o.created_at DESC
    `;
  const { rows } = await pool.query(query, [vendorId]);
  return rows;
};

exports.updateOrderStatus = async (orderId, status) => {
  const query = `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [status, orderId]);
  return rows[0];
};

// Get all products for a specific vendor
exports.getVendorByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT id FROM vendors WHERE user_id = $1",
    [userId]
  );
  return result.rows[0]; 
};
 
exports.getVendorProducts = async (vendorId) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE vendor_id = $1",
    [vendorId]
  );
  return result.rows;
};

exports.getProfile = async (userId) => {
  const query = `
    SELECT id, user_id, store_name, store_slug, store_logo, store_banner, 
           description, status, commission_rate, contact_email, phone, 
           address, social_links, rating, created_at, updated_at
    FROM vendors
    WHERE user_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

exports.updateProfile = async (
  userId,
  {
    store_name,
    store_slug,
    store_logo,
    store_banner,
    description,
    status,
    contact_email,
    phone,
    address,
    social_links,
  }
) => {
  const query = `
    UPDATE vendors
    SET store_name = $1,
        store_slug = $2,
        store_logo = $3,
        store_banner = $4,
        description = $5,
        status = $6,
        contact_email = $7,
        phone = $8,
        address = $9,
        social_links = $10,
        updated_at = NOW()
    WHERE user_id = $11
    RETURNING *;
  `;

  const values = [
    store_name,
    store_slug,
    store_logo,
    store_banner,
    description,
    status,
    contact_email,
    phone,
    address,
    social_links,
    userId,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};
