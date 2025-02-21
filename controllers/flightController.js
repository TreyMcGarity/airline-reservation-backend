// src/controllers/flightController.js
let flights = [
    { id: 1, origin: 'New York', destination: 'Paris', price: 450 },
  ];
  
  const getAllFlights = (req, res) => res.json(flights);
  
  const addFlight = (req, res) => {
    const newFlight = { id: flights.length + 1, ...req.body };
    flights.push(newFlight);
    res.status(201).json(newFlight);
  };
  
  module.exports = { getAllFlights, addFlight };
