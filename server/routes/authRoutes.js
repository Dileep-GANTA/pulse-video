// server/routes/auth.js
// ... existing imports ...
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const auth = require('../middleware/authMiddleware'); // 
// ...

// ... existing login/register routes ...

// NEW ROUTE: Get all users (for the sharing dropdown)
router.get('/users', auth, async (req, res) => {
  try {
    // Return id and username of all users EXCEPT the person requesting (don't share with yourself)
    const users = await User.find({ _id: { $ne: req.user.id } }).select('username _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;