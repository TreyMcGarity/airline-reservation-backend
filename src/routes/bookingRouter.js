const express = require('express');
const router = express.Router();
const { getAllBookings, getBookingById, updateBooking, deleteBooking, reserveFlight, getCustomerBookings, updatePaymentStatus } = require('../../controllers/bookingController');
const authMiddleware = require('../../controllers/middleware/AuthMiddleware'); // Middleware to authenticate user

//POST Booking
router.post('/bookFlight', authMiddleware, reserveFlight); // Route for logged-in Booking addition

// Get CustomerBookings
router.get('/customerReservations', authMiddleware, getCustomerBookings);

//PUT updatePaymentStatus
router.put('/:id/updateStatus', authMiddleware, updatePaymentStatus);

// GET endpoint
router.get('/', authMiddleware, getAllBookings);

// GET Booking by ID
router.get('/:id', authMiddleware, getBookingById);

// PUT (update) a Booking by ID
router.put('/:id', authMiddleware, updateBooking);

// DELETE a Booking by ID
router.delete('/:id', deleteBooking);


module.exports = router;