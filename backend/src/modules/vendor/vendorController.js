const vendorModel = require("./vendorModel");

exports.getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.getAllVendors();
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching vendors");
  }
};

exports.getVendorReport = async (req, res) => {
  try {
    const userId = req.user.id; // من التوكن

    const report = await vendorModel.getVendorReport(userId);

    if (!report) {
      return res
        .status(404)
        .json({ error: "Vendor not found or no orders yet" });
    }

    res.json({
      message: "Vendor report fetched successfully",
      data: report,
    });
  } catch (err) {
    console.error("Error fetching vendor report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get vendor orders
exports.getOrders = async (req, res) => {
    try {
    const userId = req.user.id;

    const vendor = await vendorModel.getVendorIdByUserId(userId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const orders = await vendorModel.getVendorOrders(vendor.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Get vendor orders error:", err);
    res.status(500).json({ success: false, message: "Error getting vendor orders" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await vendorModel.updateOrderStatus(id, status);
    res.json({ success: true, data: updatedOrder });
  } catch (err) {
    console.error("Update order status error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating order status" });
  }
};
// Get vendor products
exports.getProducts = async (req, res) => {
  try {
    const vendorId = req.user.id; // Assuming vendor logged in
    const products = await vendorModel.getVendorProducts(vendorId);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  }
};

// GET /api/vendor/profile
exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.id; // JWT middleware
    const profile = await vendorModel.getProfile(user_id);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching vendor profile");
  }
};

// PUT /api/vendor/profile
exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const updatedProfile = await vendorModel.updateProfile(user_id, req.body);
    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating vendor profile");
  }
};

