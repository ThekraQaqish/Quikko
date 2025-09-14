const productService = require("./productService");
const productModel = require("./productModel");

// Add Product
exports.createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    res
      .status(201)
      .json({ message: "Product added!", product: result.rows[0] });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productModel.updateProduct(id, req.body);
    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};