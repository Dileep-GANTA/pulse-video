// server/middleware/roleMiddleware.js

// This function checks if the user has the required role (e.g. 'admin' or 'editor')
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the 'auth' middleware before this runs
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

module.exports = authorize;