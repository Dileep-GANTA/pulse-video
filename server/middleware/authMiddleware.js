// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- 1. PROTECT (Checks if user is logged in) ---
// server/middleware/authMiddleware.js

// server/middleware/authMiddleware.js

const protect = async (req, res, next) => {
  let token;
  console.log("Auth Middleware: Checking for token...");

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   

    // 1. Get the user from DB
    req.user = await User.findById(decoded.user.id).select('-password');

    // 2. Check if user exists
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // 3. 👇 IMPORTANT: Attach user to the request object
  

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