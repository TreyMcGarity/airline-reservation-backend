require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());             // Enable CORS for all routes
app.use(express.json());     // Parse JSON bodies
const flightRouter = require('./routes/flightRouter');
const customerRouter = require('./routes/customerRouter');


app.use('/api/flights', flightRouter);
app.use('/api/customers', customerRouter);



// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
