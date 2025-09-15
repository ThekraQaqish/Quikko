const customerModel = require('./customerModel');

const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const profile = await customerModel.findById(user_id);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
};

const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, phone, address } = req.body;
    const updatedProfile = await customerModel.updateById(user_id, name, phone, address);
    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }
};

module.exports = { getProfile, updateProfile };
