// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// --- 1. PROTECT (Checks if user is logged in) ---
const protect = (req, res, next) => {
  // Try to get token from 'x-auth-token'
  let token = req.header('x-auth-token');

  // If not found, try to get it from 'Authorization' (Bearer token)
  if (!token && req.header('Authorization')) {
    token = req.header('Authorization').replace('Bearer ', '');
  }

  // If still no token, reject
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// --- 2. AUTHORIZE (Checks if user has the right role) ---
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorize };