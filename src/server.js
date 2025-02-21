require("dotenv").config();
// server.js (Backend)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());             // Enable CORS for all routes
app.use(express.json());     // Parse JSON bodies
const flightRoutes = require('./routes/flightRoutes');


let flights = [
  { id: 1, origin: 'New York', destination: 'Paris', price: 450 },
];

app.use('/api/flights', flightRoutes);


// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
