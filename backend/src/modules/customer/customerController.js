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

    const store = await customerModel.getStoreById(storeId);

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
exports.postOrderFromCart = async function (req, res) {
  try {
    const userId = req.user.id; // من authMiddleware
    const { cart_id, address } = req.body;

    if (!cart_id || typeof cart_id !== "number") {
      return res.status(400).json({ error: "cart_id must be a valid number" });
    }

    if (!address || !address.address_line1 || !address.city) {
      return res
        .status(400)
        .json({
          error: "Address must include at least address_line1 and city",
        });
    }

    const order = await customerModel.placeOrderFromCart(
      userId,
      cart_id,
      address
    );

    res.status(201).json({
      message: "Order placed successfully (COD)",
      order,
    });
  } catch (err) {
    console.error("Error placing order from cart:", err.message);
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

    const order = await customerModel.getOrderById(customerId, orderId);

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

    const order = await customerModel.trackOrder(orderId, customerId);

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


// Get all carts
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await customerService.getAllCarts();
    res.json(carts);
  } catch (err) {
    console.error("Error getting carts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get one cart with items
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

// Create cart
exports.createCart = async (req, res) => {
  try {
    const cart = await customerService.createCart(req.user.id);
    res.status(201).json(cart);
  } catch (err) {
    console.error("Error creating cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update cart
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

// Delete cart
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

// Add item
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

// Update item
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

// Delete item
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
