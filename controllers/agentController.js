const db = require('../data/db');

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await db('agents').select('*');
    res.status(200).json(agents);
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ message: 'Error retrieving agents', error: error.message });
  }
};

// GET Agent by ID
const getAgentById = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert to integer

    try {
      const Agent = await db('agents').where({ id }).first();

      if (Agent) {
        res.status(200).json(Agent);
      } else {
        res.status(404).json({ message: 'Agent not found' });
      }
    } catch (error) {
        console.error('specified error:', error);
        res.status(500).json({ message: 'Failed to retrieve Agent by ID', error: error.message });
    }    
  };

// Add a Agent
const addAgent = async (req, res) => {
    try {
      const [id] = await db('agents').insert(req.body).returning('id');
      res.status(201).json({ id, ...req.body });
    } catch (error) {
      console.error('specified Agent:', error);
      res.status(500).json({ message: 'Error adding Agent', error: error.message });
    }
  };

// update Agent by ID
const updateAgent = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer
  const updatedData = req.body;

  try {
    const result = await db('agents').where({ id }).update(updatedData);
    if (result) {
      res.status(200).json({ message: 'Agent updated successfully' });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ error: 'Error updating Agent' });
  }
};

// delete Agent by ID
const deleteAgent = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer

  try {
    const result = await db('agents').where({ id }).del();
    if (result) {
      res.status(200).json({ message: 'Agent deleted successfully' });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ error: 'Error deleting Agent' });
  }
};

const loggedInAgent = async (req, res) => {
    try {
        // console.log("Decoded User Object in /me:", req.user); // Debugging step

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user logged in", user: req.user });
        }

        const id = parseInt(req.user.id, 10); // Ensure it's an integer

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID", userId: req.user.id });
        }

        const Agent = await db("agents").where({ id }).first();

        if (Agent) {
            res.status(200).json(Agent);
        } else {
            res.status(404).json({ message: "Agent not found" });
        }
    } catch (error) {
        console.error("Error fetching logged-in Agent:", error);
        res.status(500).json({ message: "Failed to retrieve logged-in Agent", error: error.message });
    }
};



module.exports = { getAllAgents, getAgentById, addAgent, updateAgent, deleteAgent, loggedInAgent };
