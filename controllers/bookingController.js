const db = require('../data/db');

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
      const bookings = await db('bookings').select('*');
      res.status(200).json(bookings);
    } catch (error) {
      console.error('specified error:', error);
      res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
  };
  
  // GET booking by ID
  const getBookingById = async (req, res) => {
      const id = parseInt(req.params.id, 10); // Convert to integer
  
      try {
        const booking = await db('bookings').where({ id }).first();
  
        if (booking) {
          res.status(200).json(booking);
        } else {
          res.status(404).json({ message: 'booking not found' });
        }
      } catch (error) {
          console.error('specified error:', error);
          res.status(500).json({ message: 'Failed to retrieve booking by ID', error: error.message });
      }    
    };
  
  // update booking by ID
  const updateBooking = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert to integer
    const updatedData = req.body;
  
    try {
      const result = await db('bookings').where({ id }).update(updatedData);
      if (result) {
        res.status(200).json({ message: 'booking updated successfully' });
      } else {
        res.status(404).json({ message: 'booking not found' });
      }
    } catch (error) {
      console.error('specified error:', error);
      res.status(500).json({ error: 'Error updating booking' });
    }
  };
  
  // delete booking by ID
  const deleteBooking = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert to integer
  
    try {
      const result = await db('bookings').where({ id }).del();
      if (result) {
        res.status(200).json({ message: 'booking deleted successfully' });
      } else {
        res.status(404).json({ message: 'booking not found' });
      }
    } catch (error) {
      console.error('specified error:', error);
      res.status(500).json({ error: 'Error deleting booking' });
    }
  };

const reserveFlight = async (req, res) => {
    try {
        const { flight_id } = req.body;
        const booking_id = req.user.id; // Middleware sets user from JWT
    
        const [booking] = await db("bookings")
          .insert({ booking_id, flight_id })
          .returning(["id", "booking_id", "flight_id", "status", "created_at"]);
    
        const flight = await db("flights").where("id", flight_id).first();
    
        res.status(201).json({ 
          message: "Flight booked successfully", 
          booking: { ...booking, flight }
        });
    
      } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: "Failed to book flight" });
      }    
};

module.exports = { getAllBookings, getBookingById, updateBooking, deleteBooking, reserveFlight };
