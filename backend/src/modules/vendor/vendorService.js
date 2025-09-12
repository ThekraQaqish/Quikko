const VendorModel = require("./vendorModel");

const VendorService = {
  async getAllStores() {
    return await VendorModel.getAll();
  }
};

module.exports = VendorService;
