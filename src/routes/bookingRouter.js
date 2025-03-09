const express = require('express');
const router = express.Router();
const { getAllBookings, getBookingById, updateBooking, deleteBooking, reserveFlight, getCustomerBookings } = require('../../controllers/bookingController');
const authMiddleware = require('../../controllers/middleware/AuthMiddleware'); // Middleware to authenticate user

//POST Booking
router.post('/bookFlight', authMiddleware, reserveFlight); // Route for fetching logged-in Booking details

// Get CustomerBookings
router.get('/customerReservations', authMiddleware, getCustomerBookings);

// GET endpoint
router.get('/', authMiddleware, getAllBookings);

// GET Booking by ID
router.get('/:id', getBookingById);

// PUT (update) a Booking by ID
router.put('/:id', updateBooking);

// DELETE a Booking by ID
router.delete('/:id', deleteBooking);


module.exports = router;