const productModel = require("./productModel");

exports.createProduct = async (vendor_id, body) => {
  const now = new Date();

  const productData = {
    ...body,
    vendor_id,
    created_at: now,
    updated_at: now,
  };

  return productModel.insertProduct(productData);
};

exports.updateProduct = async (vendor_id, productId, body) => {
  return productModel.updateProduct(productId, vendor_id, body);
};

exports.deleteProduct = async (vendor_id, productId) => {
  return productModel.deleteProduct(productId, vendor_id);
};