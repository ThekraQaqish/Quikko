const paypal = require("../../infrastructure/payment/paypal");

const createPayment = async (amount) => {
  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:3000/api/payment/success",
      cancel_url: "http://localhost:3000/api/payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Test Product",
              sku: "001",
              price: amount.toFixed(2),
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: amount.toFixed(2),
        },
        description: "Payment for test product",
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) reject(error);
      else {
        const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
        resolve({ id: payment.id, forwardLink: approvalUrl.href });
      }
    });
  });
};

const executePayment = async (paymentId, payerId, amount) => {
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: amount.toFixed(2),
        },
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) reject(error);
      else resolve(payment);
    });
  });
};

module.exports = { createPayment, executePayment };
