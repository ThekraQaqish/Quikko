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
    const { vendorId } = req.params;

    if (isNaN(vendorId)) {
      return res.status(400).json({ error: "Invalid vendorId" });
    }

    const report = await vendorModel.getVendorReport(vendorId);

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
