const customerService = require("./customerService");
const customerModel = require("./customerModel");
const { validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const profile = await customerModel.findById(user_id);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching profile");
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


exports.postOrder = async function (req, res) {
  try {
    const userId = req.user.id; 
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must have at least one item" });
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
    const customerId = req.user.id; 
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
    const customerId = req.user.id; 
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

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await customerService.getAllCarts();
    res.json(carts);
  } catch (err) {
    console.error("Error getting carts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const cart = await customerService.getCartById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createCart = async (req, res) => {
  try {
    const cart = await customerService.createCart(req.user.id);
    res.status(201).json(cart);
  } catch (err) {
    console.error("Error creating cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { user_id } = req.body;
    const cart = await customerService.updateCart(req.params.id, user_id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await customerService.deleteCart(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart deleted" });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity, variant } = req.body;
    const item = await customerService.addItem(cart_id, product_id, quantity, variant);
    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { quantity, variant } = req.body;
    const item = await customerService.updateItem(req.params.id, quantity, variant);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await customerService.deleteItem(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 10 } = req.query;

    const filters = {
      search: search || null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await customerModel.getAllProducts(filters);
    return res.json(result);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Error getting products" });
  }
};
