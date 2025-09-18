const pool = require("../../config/db");

exports.findById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0];
};

exports.updateById = async (id, name, phone, address) => {
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


exports.placeOrderFromCart = async function (userId, cartId, addressData) {
  try {
    // 1. جلب جميع العناصر الموجودة في الكارت
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

    // 2. إضافة العنوان
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

    // 3. إيجاد شركة التوصيل التي تغطي هذه المدينة
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

    // 4. حساب المجموع الكلي
    let total_amount = 0;
    for (let item of cartItemsResult.rows) {
      total_amount += item.price * item.quantity;
    }

    // 5. إنشاء الأوردر
    const orderResult = await pool.query(
      `INSERT INTO orders (customer_id, delivery_company_id, status, shipping_address, total_amount, payment_status, created_at, updated_at)
       VALUES ($1, $2, 'pending', $3, $4, 'unpaid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, deliveryCompanyId, address.address_line1, total_amount]
    );

    const order = orderResult.rows[0];

    // 6. إدخال order_items
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


// Get all carts
exports.getAllCarts = async () => {
  const result = await pool.query("SELECT * FROM carts ORDER BY created_at DESC");
  return result.rows;
};

// Get one cart with items
exports.getCartById = async (id) => {
  const cartRes = await pool.query("SELECT * FROM carts WHERE id = $1", [id]);
  if (cartRes.rows.length === 0) return null;

  const itemsRes = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [id]);

  return { ...cartRes.rows[0], items: itemsRes.rows };
};

// Create cart
exports.createCart = async (userId) => {
  const result = await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  return result.rows[0];
};

// Update cart
exports.updateCart = async (id, userId) => {
  const result = await pool.query(
    "UPDATE carts SET user_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [userId, id]
  );
  return result.rows[0];
};

// Delete cart
exports.deleteCart = async (id) => {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [id]);
  const result = await pool.query("DELETE FROM carts WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

// ========== Items ==========

// Add item
exports.addItem = async (cartId, productId, quantity, variant) => {
  const result = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity, variant)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [cartId, productId, quantity, variant]
  );
  return result.rows[0];
};

// Update item
exports.updateItem = async (id, quantity, variant) => {
  const result = await pool.query(
    `UPDATE cart_items 
     SET quantity = $1, variant = $2, updated_at = NOW() 
     WHERE id = $3 RETURNING *`,
    [quantity, variant, id]
  );
  return result.rows[0];
};

// Delete item
exports.deleteItem = async (id) => {
  const result = await pool.query("DELETE FROM cart_items WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};


// Get all data from products table
exports.getAllProducts = async ({ search, categoryId, page, limit }) => {
  let baseQuery = `
    SELECT *
    FROM products
    WHERE 1=1
  `;
  const values = [];
  let idx = 1;

  if (search) {
    baseQuery += ` AND name ILIKE $${idx++}`;
    values.push(`%${search}%`);
  }

  if (categoryId) {
    baseQuery += ` AND category_id = $${idx++}`;
    values.push(categoryId);
  }

  baseQuery += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`;
  values.push(limit);
  values.push((page - 1) * limit);

  const { rows } = await pool.query(baseQuery, values);
  return rows;
};
