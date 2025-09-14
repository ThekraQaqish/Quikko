const db = require("../../config/db");

// Data from product table to add
exports.insertProduct = async (productData) => {
  const {
    vendor_id,
    name,
    description,
    price,
    stock_quantity,
    images,
    category_id,
    variants,
    created_at,
    updated_at,
  } = productData;

  const query = `
    INSERT INTO products 
    (vendor_id, name, description, price, stock_quantity, images, category_id, variants, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    vendor_id,
    name,
    description,
    price,
    stock_quantity,
    images ? JSON.stringify(images) : null,
    category_id,
    variants ? JSON.stringify(variants) : null,
    created_at,
    updated_at,
  ];

  return db.query(query, values);
};

// this is for ubdate
exports.updateProduct = async (id, productData) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    images,
    category_id,
    variants,
    updated_at,
  } = productData;

  const query = `
    UPDATE products
    SET name = $1,
        description = $2,
        price = $3,
        stock_quantity = $4,
        images = $5,
        category_id = $6,
        variants = $7,
        updated_at = NOW()
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    name,
    description,
    price,
    stock_quantity,
    images ? JSON.stringify(images) : null,
    category_id,
    variants ? JSON.stringify(variants) : null,
    id,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// this is for delete
exports.deleteProduct = async (id) => {
  const query = `DELETE FROM products WHERE id = $1;`;
  await db.query(query, [id]);
};