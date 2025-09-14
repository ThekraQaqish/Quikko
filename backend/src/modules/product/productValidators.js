exports.createProductValidator = (req, res, next) => {
  const { vendor_id, name, price } = req.body;

  if (!vendor_id || isNaN(vendor_id)) {
    return res.status(400).json({ message: "Vendor ID must be a number" });
  }
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ message: "Price must be a number" });
  }

  next();
};
