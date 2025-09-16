const pool = require('../../config/db');

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
  return result.rows[0];
};

const updateById = async (id, name, phone, address) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, phone=$2, address=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
    [name, phone, address, id]
  );
  return result.rows[0];
};
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

exports.placeOrder = async function (userId, orderData) {
  const { items, address } = orderData;

  try {
    let total_amount = 0;
    const orderItemsData = [];

    // جلب أسعار المنتجات وحساب المجموع
    for (let item of items) {
      const productResult = await pool.query(
        `SELECT price FROM products WHERE id = $1`,
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product with id ${item.product_id} not found`);
      }

      const price = productResult.rows[0].price;
      total_amount += price * item.quantity;

      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price,
        variant: JSON.stringify(item.variant || {}),
      });
    }

    // إدخال الـ order
    const orderResult = await pool.query(
      `INSERT INTO orders (customer_id, status, shipping_address, total_amount, payment_status, created_at, updated_at)
       VALUES ($1, 'pending', $2, $3, 'unpaid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, address, total_amount]
    );

    const order = orderResult.rows[0];

    // إدخال الـ order_items
    for (let item of orderItemsData) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, variant)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.quantity, item.price, item.variant]
      );
    }

    return order;
  } catch (err) {
    throw err;
  }
};

exports.getOrderById = async function (customerId, orderId) {
  const result = await pool.query(
    `
    SELECT 
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
    GROUP BY o.id
    `,
    [orderId, customerId]
  );

  return result.rows[0];
};
exports.trackOrder = async function (orderId, customerId) {
  const result = await pool.query(
    `
    SELECT 
      o.id AS order_id,
      o.status,
      o.updated_at
    FROM orders o
    WHERE o.id = $1 AND o.customer_id = $2
    `,
    [orderId, customerId]
  );

  return result.rows[0];
};


module.exports = { findById, updateById };
