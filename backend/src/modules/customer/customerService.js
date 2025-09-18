const customerModel = require("./customerModel");

// Carts
exports.getAllCarts = async () => await customerModel.getAllCarts();
exports.getCartById = async (id) => await customerModel.getCartById(id);
exports.createCart = async (userId) => await customerModel.createCart(userId);
exports.updateCart = async (id, userId) => await customerModel.updateCart(id, userId);
exports.deleteCart = async (id) => await customerModel.deleteCart(id);

// Items
exports.addItem = async (cartId, productId, quantity, variant) =>
  await customerModel.addItem(cartId, productId, quantity, variant);

exports.updateItem = async (id, quantity, variant) =>
  await customerModel.updateItem(id, quantity, variant);

exports.deleteItem = async (id) => await customerModel.deleteItem(id);



