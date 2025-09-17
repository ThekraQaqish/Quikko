const pool = require("../../config/db");

exports.getAllVendors = async () => {
  const result = await pool.query("SELECT * FROM vendors");
  return result.rows;
};

exports.getVendorReport = async (vendorId) => {
  const query = `
    SELECT 
      v.id AS vendor_id,
      v.store_name,
      COUNT(DISTINCT o.id) AS total_orders,
      SUM(oi.quantity * oi.price) AS total_sales
    FROM vendors v
    JOIN products p ON v.id = p.vendor_id
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE v.id = $1
    GROUP BY v.id, v.store_name
    ORDER BY total_sales DESC;
  `;

  const { rows } = await pool.query(query, [vendorId]);
  return rows[0];
};


exports.getVendorIdByUserId = async (userId) => {
  const query = `SELECT id FROM vendors WHERE user_id = $1`;
  const { rows } = await pool.query(query, [userId]);
  return rows[0]; 
};

// Get all orders that include vendor's products
exports.getVendorOrders = async (vendorId) => {
  const query = `
      SELECT
        o.id AS order_id,
        o.status,
        o.total_amount,
        o.shipping_address,
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

// Update order status
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
