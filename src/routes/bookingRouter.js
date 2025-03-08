const express = require('express');
const router = express.Router();
const { getAllBookings, getBookingById, updateBooking, deleteBooking, reserveFlight } = require('../../controllers/bookingController');
const authMiddleware = require('../../controllers/middleware/AuthMiddleware'); // Middleware to authenticate user

//
router.post('/bookFlight', authMiddleware, reserveFlight); // Route for fetching logged-in Booking details

// GET endpoint
router.get('/', getAllBookings);

// GET Booking by ID
router.get('/:id', getBookingById);

// PUT (update) a Booking by ID
router.put('/:id', updateBooking);

// DELETE a Booking by ID
router.delete('/:id', deleteBooking);


module.exports = router;