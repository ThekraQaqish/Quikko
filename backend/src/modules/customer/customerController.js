const customerModel = require('./customerModel');

exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const profile = await customerModel.findById(user_id);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, phone, address } = req.body;
    const updatedProfile = await customerModel.updateById(
      user_id,
      name,
      phone,
      address
    );
    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile");
  }
};

exports.fetchStoreDetails = async function (req, res) {
  try {
    const { storeId } = req.params;

    if (isNaN(storeId)) {
      return res.status(400).json({ error: "Invalid store ID" });
    }

    const store = await customer.getStoreById(storeId);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({
      message: "Store details fetched successfully",
      data: store,
    });
  } catch (err) {
    console.error("Error fetching store details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Place order endpoint
// Place order endpoint
// controllers/customerController.js
exports.postOrder = async function (req, res) {
  try {
    const userId = req.user.id; // من authMiddleware
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }

    if (!address) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    const order = await customer.placeOrder(userId, { items, address });

    res.status(201).json({
      message: "Order placed successfully (COD)",
      order,
    });
  } catch (err) {
    console.error("Error placing order:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getOrderDetails = async function (req, res) {
  try {
    const customerId = req.user.id; // جاي من التوكن
    const { orderId } = req.params;
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await customer.getOrderById(customerId, orderId);

    if (!order) {
      return res
        .status(403)
        .json({ error: "You do not have access to this order" });
    }

    res.json({
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.trackOrder = async function (req, res) {
  try {
    const customerId = req.user.id; // من التوكن
    const orderId = req.params.orderId;

    const order = await customer.trackOrder(orderId, customerId);

    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found or not authorized" });
    }

    res.json({
      message: "Order status fetched successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error tracking order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

