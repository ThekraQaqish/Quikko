const authService = require('./authService');

/**
 * @module AuthController
 * @desc Handles HTTP requests for user authentication, registration, and login.
 */

/**
 * @function registerUser
 * @desc Registers a new customer in the system. Calls `authService.register` with role 'customer'.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - User registration data
 * @param {string} req.body.name - Full name of the user
 * @param {string} req.body.email - Email address
 * @param {string} req.body.password - Password
 * @param {Object} res - Express response object
 *
 * @returns {void} Returns 201 with sanitized user data or 400 on error
 *
 * @example
 * POST /api/auth/register
 * Body: { "name": "John Doe", "email": "john@example.com", "password": "123456" }
 */
exports.registerUser = async (req, res) => {
  try {
    const { postgresUser, firebaseUser } = await authService.register(req.body, 'customer');

    const userData = {
      id: postgresUser.id,
      name: postgresUser.name,
      email: postgresUser.email,
      phone: postgresUser.phone,
      role: postgresUser.role,
    };

    res.status(201).json({ message: 'Customer registered successfully', user: userData });
  } catch (err) {
    console.error('Register customer error:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function registerVendor
 * @desc Registers a new vendor. Calls `authService.register` with role 'vendor'.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Vendor registration data
 * @param {string} req.body.store_name - Store name
 * @param {string} req.body.email - Email address
 * @param {string} req.body.password - Password
 * @param {Object} res - Express response object
 *
 * @returns {void} Returns 201 with sanitized vendor data or 400 on error
 */
exports.registerVendor = async (req, res) => {
  try {
    const { postgresUser, firebaseUser } = await authService.register(req.body, 'vendor');

    const userData = {
      id: postgresUser.id,
      name: postgresUser.name,
      email: postgresUser.email,
      phone: postgresUser.phone,
      role: postgresUser.role,
      store_name: req.body.store_name,
    };

    res.status(201).json({ message: 'Vendor registered successfully', user: userData });
  } catch (err) {
    console.error('Register vendor error:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function registerDelivery
 * @desc Registers a new delivery company. Calls `authService.register` with role 'delivery'.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Delivery registration data
 * @param {string} req.body.company_name - Company name
 * @param {string} req.body.email - Email address
 * @param {string} req.body.password - Password
 * @param {Object} res - Express response object
 *
 * @returns {void} Returns 201 with sanitized delivery data or 400 on error
 */
exports.registerDelivery = async (req, res) => {
  try {
    const { postgresUser, firebaseUser } = await authService.register(req.body, 'delivery');

    const userData = {
      id: postgresUser.id,
      name: postgresUser.name,
      email: postgresUser.email,
      phone: postgresUser.phone,
      role: postgresUser.role,
      company_name: req.body.company_name,
    };

    res.status(201).json({ message: 'Delivery registered successfully', user: userData });
  } catch (err) {
    console.error('Register delivery error:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function login
 * @desc Authenticates a user and returns a JWT token.
 *       Handles different error codes for unapproved accounts, invalid credentials, or not found users.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {Object} res - Express response object
 *
 * @returns {void} Returns 200 with JWT token if successful, or appropriate error code
 *
 * @example
 * POST /api/auth/login
 * Body: { "email": "user@example.com", "password": "123456" }
 */
exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    switch (err.code) {
      case 'NOT_APPROVED':
        return res.status(403).json({ error: err.message });
      case 'NOT_FOUND_RECORD':
        return res.status(400).json({ error: err.message });
      case 'INVALID_CREDENTIALS':
      case 'USER_NOT_FOUND':
        return res.status(401).json({ error: err.message });
      default:
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
