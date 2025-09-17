const productService = require("./productService");
const productModel = require("./productModel");

// Get Product by ID
const getProduct = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).send("Error fetching product");
  }
};

// Add Product
const createProduct = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const result = await productService.createProduct(vendorId, req.body);
    res
      .status(201)
      .json({ message: "Product added!", product: result.rows[0] });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;
    const updatedProduct = await productService.updateProduct(id, vendorId, req.body);

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    await productService.deleteProduct(id, vendorId);

    if (!deleted) return res.status(404).json({ message: "Product not found" });
    
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
