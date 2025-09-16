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

// Place order endpoint
// Place order endpoint
// controllers/customerController.js
exports.postOrder = async function (req, res) {
  try {
    const userId = req.user.id; // من authMiddleware
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

// Get All the Carts
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await customerService.getCart(userId);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get One Cart by it's id
exports.getOneCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await customerModel.getOneCart(id, userId);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity, variant } = req.body;

    const cartData = {
      user_id: userId,
      product_id,
      quantity,
      variant,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await customerService.addToCart(cartData);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update cart
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedCart = await customerModel.updateCart(id, userId, req.body);
    res.json({ message: "Cart updated successfully", data: updatedCart });
  } catch (err) {
    console.error("Update Cart error:", err);
    res.status(500).json({ message: "Error updating cart" });
  }
};

// Delete cart
exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await customerModel.deleteCart(id, userId);
    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.error("Delete Cart error:", err);
    res.status(500).json({ message: "Error deleting cart" });
  }
};

// Get all products with filter and search
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
