const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || "wubbalubbadubdub";

// Register a new user
const Register = async (req, res) => {
    try {
        const { first_name, last_name, phone, email, password } = req.body;

        // Check if user already exists
        const existingUser = await db('customers').where({ email }).first();
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const [newUser] = await db('customers')
            .insert({
                first_name,
                last_name,
                phone,
                email,
                password: hashedPassword
            })
            .returning(['id', 'first_name', 'last_name', 'email']);

        // Generate JWT token
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ message: 'Registration successful', user: newUser, token });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

// Login user
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await db("customers").where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Ensure id is an integer
        const userId = parseInt(user.id, 10);
        if (isNaN(userId)) {
            return res.status(500).json({ error: "User ID is not a valid number" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: userId, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

// Logout user (invalidate token client-side)
const Logout = async (req, res) => {
    try {
        // Logout is typically handled client-side by clearing the token
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed', details: error.message });
    }
};


module.exports = {Register, Login, Logout};
