exports.createProductValidator = (req, res, next) => {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ message: "Price must be a number" });
  }

  next();
};
