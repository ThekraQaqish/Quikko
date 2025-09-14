const productModel = require("./productModel");

exports.createProduct = async (body) => {
  const now = new Date();

  const productData = {
    ...body,
    created_at: now,
    updated_at: now,
  };

  return productModel.insertProduct(productData);
};