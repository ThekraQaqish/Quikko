const pool = require("../../config/db");

async function getAllDeliveryCompanies() {
  const result = await pool.query(
    `SELECT id AS company_id, user_id, company_name, coverage_areas, status, created_at, updated_at
     FROM delivery_companies
     ORDER BY created_at DESC`
  );
  return result.rows;
}

const getAllVendors = async () => {
  const query = `
    SELECT 
      v.id AS vendor_id,
      v.user_id,
      v.store_name,
      v.status,
      v.commission_rate,
      v.contact_email,
      v.phone,
      COALESCE(
        json_agg(
          json_build_object(
            'product_id', p.id,
            'name', p.name,
            'price', p.price,
            'stock_quantity', p.stock_quantity
          )
        ) FILTER (WHERE p.id IS NOT NULL), '[]'
      ) AS products
    FROM vendors v
    LEFT JOIN products p ON p.vendor_id = v.id
    GROUP BY v.id
    ORDER BY v.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};


module.exports = {
  getAllDeliveryCompanies, getAllVendors
};
