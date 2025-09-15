const pool = require("../../config/db");

// Create a new payment record
async function createPayment({ orderId, paymentMethod, amount, status = "pending", transactionId }) {
  const query = `
    INSERT INTO payments (order_id, payment_method, amount, status, transaction_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [orderId, paymentMethod, amount, status, transactionId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Update payment status
async function updatePaymentStatus(transactionId, status) {
  const query = `
    UPDATE payments
    SET status = $2, updated_at = CURRENT_TIMESTAMP
    WHERE transaction_id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [transactionId, status]);
  return result.rows[0];
}

// Get payment by transaction ID
async function getPaymentByTransactionId(transactionId) {
  const query = `SELECT * FROM payments WHERE transaction_id = $1`;
  const result = await pool.query(query, [transactionId]);
  return result.rows[0];
}

// Get payments by order ID
async function getPaymentsByOrder(orderId) {
  const query = `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC`;
  const result = await pool.query(query, [orderId]);
  return result.rows;
}

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentByTransactionId,
  getPaymentsByOrder,
};

