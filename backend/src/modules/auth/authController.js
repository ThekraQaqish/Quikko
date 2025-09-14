const authService = require('./authService');
const { generateSlug } = require('../../utils/stringHelpers'); // ⬅️ هنا


exports.registerUser = async (req, res) => {
  try {
    const data = await authService.register(req.body, 'customer');
    res.status(201).json({ message: 'Customer registered successfully', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  
};

exports.registerVendor = async (req, res) => {
  try {
    const data = await authService.register(req.body, 'vendor');
    res.status(201).json({ message: 'Vendor registered successfully', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.registerDelivery = async (req, res) => {
  try {
    const data = await authService.register(req.body, 'delivery');
    res.status(201).json({ message: 'Delivery registered successfully', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    if (err.code === 'NOT_APPROVED') return res.status(403).json({ error: err.message });
    if (err.code === 'NOT_FOUND_RECORD') return res.status(400).json({ error: err.message });
    if (err.code === 'INVALID_CREDENTIALS' || err.code === 'USER_NOT_FOUND')
      return res.status(401).json({ error: err.message });

    res.status(500).json({ error: 'Internal server error' });
  }
};