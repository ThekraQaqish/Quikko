const vendorModel = require('./vendorModel');

const getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.getAllVendors();
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching vendors');
  }
};

module.exports = { getVendors };
