// src/middleware/guestToken.js
const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  // إذا المستخدم مسجل، لا نعمل أي كوكي للـ guest
  if (req.customerId) return next();

  if (!req.cookies?.guest_token) {
    const token = uuidv4();
    res.cookie('guest_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    req.guestToken = token;
  } else {
    req.guestToken = req.cookies.guest_token;
  }

  next();
};
