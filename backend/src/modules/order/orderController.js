const orderModel = require('./orderModel');

const getOrders = async (req, res) => {
  try {
    const customer_id = req.user.id; 
    const orders = await orderModel.getCustomerOrders(customer_id);

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
};

module.exports = { getOrders };
