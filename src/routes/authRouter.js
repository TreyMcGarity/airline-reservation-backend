// routes/auth/index.js
const express = require('express');
const router = express.Router();
const { Register, Login, Logout } = require('../../controllers/authController');

const validRoles = new Set(['customer', 'agent']);
const ensureRole = (req, res, next) => {
  const role = String(req.params.role || '').toLowerCase();
  if (!validRoles.has(role)) {
    return res.status(400).json({ error: `Invalid role "${req.params.role}". Allowed: customer, agent` });
  }
  req.params.role = role; // normalize
  next();
};

// Role-aware endpoints
router.post('/:role/register', ensureRole, Register);
router.post('/:role/login', ensureRole, Login);

// Optional: legacy aliases (default to 'customer')
const setRole = (role) => (req, _res, next) => { req.params.role = role; next(); };
router.post('/register', setRole('customer'), Register);
router.post('/login', setRole('customer'), Login);

// Logout (no role needed)
router.post('/logout', Logout);

module.exports = router;
