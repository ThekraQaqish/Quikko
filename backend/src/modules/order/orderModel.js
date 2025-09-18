const pool = require('../../config/db');

const getCustomerOrders = async (customer_id) => {
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

module.exports = { getCustomerOrders };
