const VendorModel = require("./vendorModel");

exports.VendorService = {
  async getAllStores() {
    return await VendorModel.getAll();
  }
};


