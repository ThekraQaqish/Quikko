const customerModel = require("./customerModel");

exports.getCart = async (userId) => {
  return customerModel.getCart(userId);
};

exports.getOneCart = async (id, userId) => {
  return customerModel.getOneCart(id, userId);
};

exports.addToCart = async (body) => {
  const now = new Date();

  const cartData = {
    ...body,
    created_at: now,
    updated_at: now,
  };

  return customerModel.insertIntoCart(cartData);
};