// src/routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const { getAllFlights, addFlight } = require('../../controllers/flightController');

// GET endpoint
router.get('/', getAllFlights);

// POST endpoint
router.post('/', addFlight);

module.exports = router;
