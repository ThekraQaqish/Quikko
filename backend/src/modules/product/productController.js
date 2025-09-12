const productModel = require('./productModel');

const getProduct = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching product');
  }
};

module.exports = { getProduct };
