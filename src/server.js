const path = require('path');
// 👉 Force dotenv to read the .env that sits NEXT TO this file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { webhook: paymentsWebhook } = require('./routes/paymentRouter');

// --- sanity log (masked) ---
const rawKey = (process.env.STRIPE_SECRET_KEY || '').trim().replace(/^['"]|['"]$/g, '');
console.log('[Stripe] secret loaded?', !!rawKey, 'prefix:', rawKey.slice(0,7), 'len:', rawKey.length);

const server = express();

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://treymcgarity.github.io'
];
server.use(cors({ origin(origin, cb){ if (!origin || allowedOrigins.includes(origin)) return cb(null,true); cb(new Error(`CORS blocked: ${origin}`)); }}));
server.use(helmet());
server.use(morgan('dev'));

// webhook BEFORE json
server.post('/api/payments/webhook', paymentsWebhook);
server.use(express.json());

// mount /api (includes /api/payments)
server.use('/api', require('./routes/routerIndex'));

// tiny debug route (safe)
server.get('/api/debug/stripe', (_req, res) => {
  res.json({ loaded: !!rawKey, prefix: rawKey.slice(0,7), length: rawKey.length });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
