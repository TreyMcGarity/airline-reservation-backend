require("dotenv").config();
const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());             // Enable CORS for all routes
server.use(express.json());     // Parse JSON bodies

server.use("/api", require("./routes/routerIndex"));


// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
