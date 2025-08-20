const express = require('express');
const router = express.Router();
const { getAllAgents, getAgentById, addAgent, updateAgent, deleteAgent,loggedInAgent } = require('../../controllers/AgentController');
const authMiddleware = require('../../controllers/middleware/AuthMiddleware'); // Middleware to authenticate user

// Get loggedIn Agent
router.get('/me', authMiddleware, loggedInAgent); // Route for fetching logged-in Agent details

// GET endpoint
router.get('/', getAllAgents);

// GET Agent by ID
router.get('/:id', getAgentById);

// POST endpoint
router.post('/', addAgent);

// PUT (update) a Agent by ID
router.put('/:id', updateAgent);

// DELETE a Agent by ID
router.delete('/:id', deleteAgent);

module.exports = router;