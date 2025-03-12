const db = require('../data/db');

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await db('bookings').select('*');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const booking = await db('bookings').where({ id }).first();

        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: 'Failed to retrieve booking by ID', error: error.message });
    }
};

// Update booking by ID
const updateBooking = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedData = req.body;

    if (!Object.keys(updatedData).length) {
        return res.status(400).json({ error: "No data provided for update." });
    }

    try {
        const result = await db('bookings').where({ id }).update(updatedData);
        if (result) {
            res.status(200).json({ message: 'Booking updated successfully' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Error updating booking' });
    }
};

// Delete booking by ID
const deleteBooking = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const booking = await db("bookings").where({ id }).first();
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await db("bookings").where({ id }).del();
        res.status(200).json({ message: "Booking deleted successfully" });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Error deleting booking" });
    }
};

// Reserve a flight
const reserveFlight = async (req, res) => {
    try {
        const { flight_id } = req.body;
        const customer_id = req.user.id; 

        console.log("Booking Debug - Customer ID:", customer_id);
        console.log("Booking Debug - Flight ID:", flight_id);

        if (!customer_id) {
            return res.status(401).json({ error: "Unauthorized: Invalid user." });
        }

        // Check if flight exists
        const flight = await db("flights").where("id", flight_id).first();
        if (!flight) {
            console.log("Flight not found in DB:", flight_id);
            return res.status(404).json({ error: "Flight not found." });
        }
        console.log("Flight found:", flight);

        // Prevent duplicate bookings
        const existingBooking = await db("bookings")
            .where({ customer_id, flight_id })
            .first();

        if (existingBooking) {
            console.log("Duplicate booking detected:", existingBooking);
            return res.status(400).json({ error: "You have already booked this flight." });
        }

        // Insert booking
        const [booking] = await db("bookings")
            .insert({ customer_id, flight_id, status: "pending" })
            .returning(["id", "customer_id", "flight_id", "status", "created_at"]);

        console.log("Booking successfully created:", booking);

        res.status(201).json({ 
            message: "Flight booked successfully", 
            booking: { ...booking, flight }
        });

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: "Failed to book flight" });
    }
};

const getCustomerBookings = async (req, res) => {
    try {
        const customer_id = req.user.id; // Extract from authenticated user

        const bookings = await db("bookings")
            .join("flights", "bookings.flight_id", "flights.id") // Join flights table
            .where("bookings.customer_id", customer_id)
            .select(
                "bookings.id as booking_id",
                "flights.id as flight_id",
                "flights.origin",          
                "flights.destination",      
                "flights.departure_time",     
                "flights.arrival_time",       
                "flights.airline",           
                "flights.flight_number",     
                "flights.price",              
                "bookings.status",
                "bookings.created_at"
            );

        console.log("Found Bookings:", bookings);

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this customer." });
        }

        res.status(200).json(bookings);

    } catch (error) {
        console.error("Error fetching customer bookings:", error);
        res.status(500).json({ error: "Failed to retrieve bookings." });
    }
};

const updatePaymentStatus = async (req, res) => {
    console.log(req.params.id, 'and ', req.body.status)
    const id = parseInt(req.params.id, 10);
    const updatedStatus = req.body.status;

    // Validate input
    if (!updatedStatus) {
        return res.status(400).json({ error: "Status is required to update booking." });
    }

    const existingBooking = await db('bookings')
    .where({ id })
    .select('status')
    .first();

    // Also Check if booking exists
    if (!existingBooking) {
    return res.status(404).json({ message: 'Booking not found' });
    }

    // Also Check if status is already "Paid"
    if (existingBooking.status === "Paid") {
    return res.status(200).json({ message: "Booking is already marked as Paid" });
    }

    try {
        const result = await db('bookings')
            .where({ id })
            .update({ status: updatedStatus })
            .returning('*')

        if (result.length) {
            res.status(200).json({ message: 'Booking status updated successfully'});
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
            console.error("Update error details:", error); // Log the full error
            res.status(500).json({ error: "Error updating booking status", details: error.message });
    }
};

module.exports = { getAllBookings, getBookingById, updateBooking, deleteBooking, reserveFlight, getCustomerBookings, updatePaymentStatus};
