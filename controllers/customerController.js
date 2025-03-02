const db = require('../data/db');

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await db('customers').select('*');
    res.status(200).json(customers);
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ message: 'Error retrieving customers', error: error.message });
  }
};

// GET customer by ID
const getCustomerById = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert to integer

    try {
      const customer = await db('customers').where({ id }).first();

      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: 'customer not found' });
      }
    } catch (error) {
        console.error('specified error:', error);
        res.status(500).json({ message: 'Failed to retrieve customer by ID', error: error.message });
    }    
  };

// Add a customer
const addCustomer = async (req, res) => {
    try {
      const [id] = await db('customers').insert(req.body).returning('id');
      res.status(201).json({ id, ...req.body });
    } catch (error) {
      console.error('specified customer:', error);
      res.status(500).json({ message: 'Error adding customer', error: error.message });
    }
  };

// update customer by ID
const updateCustomer = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer
  const updatedData = req.body;

  try {
    const result = await db('customers').where({ id }).update(updatedData);
    if (result) {
      res.status(200).json({ message: 'customer updated successfully' });
    } else {
      res.status(404).json({ message: 'customer not found' });
    }
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ error: 'Error updating customer' });
  }
};

// delete customer by ID
const deleteCustomer = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert to integer

  try {
    const result = await db('customers').where({ id }).del();
    if (result) {
      res.status(200).json({ message: 'customer deleted successfully' });
    } else {
      res.status(404).json({ message: 'customer not found' });
    }
  } catch (error) {
    console.error('specified error:', error);
    res.status(500).json({ error: 'Error deleting customer' });
  }
};

const loggedInCustomer = async (req, res) => {
    try {
        console.log("Decoded User Object in /me:", req.user); // Debugging step

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user logged in", user: req.user });
        }

        const id = parseInt(req.user.id, 10); // Ensure it's an integer

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID", userId: req.user.id });
        }

        const customer = await db("customers").where({ id }).first();

        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (error) {
        console.error("Error fetching logged-in customer:", error);
        res.status(500).json({ message: "Failed to retrieve logged-in customer", error: error.message });
    }
};



module.exports = { getAllCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer, loggedInCustomer };
