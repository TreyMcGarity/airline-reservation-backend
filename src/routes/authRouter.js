const express = require('express');
const router = express.Router();
const { Register, Login, Logout } = require('../../controllers/authController');

// Customer Registration
router.post('/register', Register);

// Customer Login
router.post('/login', Login);

// Customer Logout
router.post('/logout', Logout);

module.exports = router;
