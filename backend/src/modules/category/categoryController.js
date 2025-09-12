const categoryModel = require('./categoryModel');

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching categories');
  }
};

module.exports = { getCategories };
