const { verifyToken } = require('../utils/token');

/**
 * @function protect
 * @desc Middleware to protect routes by verifying JWT token.
 *       Adds the decoded user information to req.user if valid.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Calls next() if token is valid, else responds with 401
 * @example
 * router.get('/profile', protect, (req, res) => {
 *   res.json({ user: req.user });
 * });
 */
exports.protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};

/**
 * @function authorizeRole
 * @desc Middleware to restrict access to specific user roles.
 *       Must be used after `protect` middleware.
 * 
 * @param {...string} roles - Allowed roles for the route
 * @returns {Function} Express middleware function
 * @example
 * router.post('/admin', protect, authorizeRole('admin'), (req, res) => {
 *   res.send('Welcome, admin!');
 * });
 */
exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
        next();
    };
};

