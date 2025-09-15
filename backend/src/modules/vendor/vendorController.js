const vendorModel = require('./vendorModel');

const getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.getAllVendors();
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching vendors');
  }
};
const getVendorReport = async (req, res) => {
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

module.exports = { getVendors, getVendorReport };
