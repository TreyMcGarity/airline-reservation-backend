const db = require('../data/db');

// Get all flights
const getAllFlights = async (req, res) => {
  try {
    const flights = await db('flights').select('*');
    res.status(200).json(flights);
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ message: 'Error retrieving flights', error: error.message });
  }
};

// GET flight by ID
const getFlightById = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert to integer

    try {
      const flight = await db('flights').where({ id }).first();

      if (flight) {
        res.status(200).json(flight);
      } else {
        res.status(404).json({ message: 'Flight not found' });
      }
    } catch (error) {
        console.error('specified error:', error);
        res.status(500).json({ message: 'Failed to retrieve flight by ID', error: error.message });
    }    
  };

// Add a flight
const addFlight = async (req, res) => {
    try {
      const [id] = await db('flights').insert(req.body).returning('id');
      res.status(201).json({ id, ...req.body });
    } catch (error) {
      console.error('specified flight:', error);
      res.status(500).json({ message: 'Error adding flight', error: error.message });
    }
  };

// update flight by ID
const updateFlight = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer
  const updatedData = req.body;

  try {
    const result = await db('flights').where({ id }).update(updatedData);
    if (result) {
      res.status(200).json({ message: 'Flight updated successfully' });
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ error: 'Error updating flight' });
  }
};

// delete flight by ID
const deleteFlight = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer

  try {
    const result = await db('flights').where({ id }).del();
    if (result) {
      res.status(200).json({ message: 'Flight deleted successfully' });
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ error: 'Error deleting flight' });
  }
};

module.exports = { getAllFlights, getFlightById, addFlight, updateFlight, deleteFlight };
