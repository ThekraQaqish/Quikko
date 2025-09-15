const pool = require('../../config/db');

const getAllVendors = async () => {
  const result = await pool.query('SELECT * FROM vendors');
  return result.rows;
};

async function getVendorReport(vendorId) {
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

}
module.exports = { getAllVendors, getVendorReport };
