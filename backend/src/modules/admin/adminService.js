const pool = require('../../config/db'); 

const getAllOrders = async () => {
  const query = `
    SELECT 
      o.id AS order_id,
      o.status,
      o.total_amount,
      o.payment_status,
      o.created_at,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      ) AS customer,
      json_build_object(
        'id', dc.id,
        'company_name', dc.company_name,
        'user', json_build_object(
          'id', du.id,
          'name', du.name,
          'email', du.email
        )
      ) AS delivery_company,
      json_agg(
        json_build_object(
          'product_id', p.id,
          'name', p.name,
          'vendor', json_build_object(
            'id', v.id,
            'name', vu.name
          ),
          'quantity', oi.quantity,
          'price', oi.price,
          'variant', oi.variant
        )
      ) AS items
    FROM orders o
    JOIN users u ON u.id = o.customer_id
    LEFT JOIN delivery_companies dc ON dc.id = o.delivery_company_id
    LEFT JOIN users du ON du.id = dc.user_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    JOIN vendors v ON v.id = p.vendor_id
    JOIN users vu ON vu.id = v.user_id
    GROUP BY o.id, u.id, dc.id, du.id;
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = { getAllOrders };
