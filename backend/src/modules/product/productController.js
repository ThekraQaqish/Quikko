const productService = require("./productService");
const productModel = require("./productModel");

/**
 * @module ProductController
 * @desc Handles product-related operations including fetching, creating, updating, and deleting products.
 */

/**
 * Get a single product by its ID.
 *
 * @async
 * @function getProduct
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Product ID to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 *
 * @example
 * GET /api/products/1
 */
exports.getProduct = async (req, res) => {
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

/**
 * Create a new product for a vendor.
 *
 * @async
 * @function createProduct
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object from middleware.
 * @param {number} req.user.id - Vendor ID.
 * @param {Object} req.body - Product data including name, description, price, etc.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 *
 * @example
 * POST /api/products
 * Body: { name: "Product A", price: 25.5, description: "A great product" }
 */
exports.createProduct = async (req, res) => {
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

/**
 * Update an existing product.
 *
 * @async
 * @function updateProduct
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Product ID to update.
 * @param {Object} req.user - Authenticated user object from middleware.
 * @param {number} req.user.id - Vendor ID.
 * @param {Object} req.body - Updated product data.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 *
 * @example
 * PUT /api/products/1
 * Body: { name: "Updated Product", price: 30 }
 */
exports.updateProduct = async (req, res) => {
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

/**
 * Delete a product.
 *
 * @async
 * @function deleteProduct
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Product ID to delete.
 * @param {Object} req.user - Authenticated user object from middleware.
 * @param {number} req.user.id - Vendor ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 *
 * @example
 * DELETE /api/products/1
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    const deleted = await productService.deleteProduct(id, vendorId);

    if (!deleted) return res.status(404).json({ message: "Product not found" });
    
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};

