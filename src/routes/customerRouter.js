const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer } = require('../../controllers/customerController');

// GET endpoint
router.get('/', getAllCustomers);

// GET customer by ID
router.get('/:id', getCustomerById);

// POST endpoint
router.post('/', addCustomer);

// PUT (update) a customer by ID
router.put('/:id', updateCustomer);

// DELETE a customer by ID
router.delete('/:id', deleteCustomer);



module.exports = router;