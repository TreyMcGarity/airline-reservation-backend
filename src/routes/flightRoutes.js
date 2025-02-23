const express = require('express');
const router = express.Router();
const { getAllFlights, getFlightById, addFlight, updateFlight, deleteFlight, searchFlights } = require('../../controllers/flightController');

// GET endpoint
router.get('/', getAllFlights);

// SEARCH flight by origin, destination, and depature time
router.get('/search', searchFlights)

// GET flight by ID
router.get('/:id', getFlightById);

// POST endpoint
router.post('/', addFlight);

// PUT (update) a flight by ID
router.put('/:id', updateFlight);

// DELETE a flight by ID
router.delete('/:id', deleteFlight);



module.exports = router;
