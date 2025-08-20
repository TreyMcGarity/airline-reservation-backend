const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set; tokens cannot be verified across restarts.');
}

const ROLE_TABLE = {
  customer: 'customers',
  agent: 'agents',
};

function tableFromRole(role) {
  const t = ROLE_TABLE[role];
  if (!t) {
    const allowed = Object.keys(ROLE_TABLE).join(', ');
    const e = new Error(`Invalid role "${role}". Allowed: ${allowed}`);
    e.status = 400;
    throw e;
  }
  return t;
}

function signToken({ id, email, role }) {
  // include role in the token so you can authorize later
  return jwt.sign({ sub: `${role}:${id}`, id, email, role }, JWT_SECRET, { expiresIn: '24h' });
}

// POST /auth/:role/register
const Register = async (req, res) => {
  try {
    const { role } = req.params;                    // "customer" | "agent"
    const table = tableFromRole(role);

    const { first_name, last_name, phone, email, password } = req.body || {};
    if (!first_name || !last_name || !phone || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // (Optional) enforce global unique email across both roles:
    // const existsAnywhere =
    //   await db('customers').where({ email }).first() || await db('agents').where({ email }).first();

    const existingUser = await db(table).where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await db(table)
      .insert({
        first_name,
        last_name,
        phone,
        email,
        password: hashedPassword,
      })
      .returning(['id', 'first_name', 'last_name', 'email']);

    const token = signToken({ id: newUser.id, email: newUser.email, role });

    res.status(201).json({
      message: 'Registration successful',
      user: { ...newUser, role },
      token,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: 'Registration failed', details: error.message });
  }
};

// POST /auth/:role/login
const Login = async (req, res) => {
  try {
    const { role } = req.params;                    // "customer" | "agent"
    const table = tableFromRole(role);

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db(table).where({ email }).first();
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const userId = Number(user.id);
    if (!Number.isInteger(userId)) {
      return res.status(500).json({ error: 'User ID is not a valid number' });
    }

    const token = signToken({ id: userId, email: user.email, role });

    res.status(200).json({
      message: 'Login successful',
      token,
      role,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: 'Login failed', details: error.message });
  }
};

// POST /auth/logout (client clears token)
const Logout = async (_req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed', details: error.message });
  }
};

module.exports = { Register, Login, Logout };
