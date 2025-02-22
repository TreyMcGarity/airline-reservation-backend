const express = require('express');
const router = express.Router();
const { getAllFlights, getFlightById, addFlight, updateFlight, deleteFlight } = require('../../controllers/flightController');

// GET endpoint
router.get('/', getAllFlights);

// GET flight by ID
router.get('/:id', getFlightById);

// POST endpoint
router.post('/', addFlight);

// PUT (update) a flight by ID
router.put('/:id', updateFlight);

// DELETE a flight by ID
router.delete('/:id', deleteFlight);

module.exports = router;
