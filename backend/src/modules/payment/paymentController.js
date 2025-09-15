const paymentService = require("./paymentService");

const createPayment = async (req, res) => {
  try {
    const { amount } = req.body; // المبلغ من الفرونت
    const payment = await paymentService.createPayment(amount);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const executePayment = async (req, res) => {
  try {
    const { paymentId, PayerID } = req.query;
    const amount = 1.00; //بجي من الداتابيز بدل الثابت
    const payment = await paymentService.executePayment(paymentId, PayerID, amount);
    res.json({ status: "success", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelPayment = (req, res) => {
  res.send("Payment canceled");
};

module.exports = { createPayment, executePayment, cancelPayment };
