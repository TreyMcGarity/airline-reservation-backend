const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// --- Clean the key: strip quotes, spaces, and CR/LF ---
const SK = (process.env.STRIPE_SECRET_KEY || '')
  .replace(/\r?\n|\r/g, '')       // remove any newline chars
  .trim()                         // trim spaces
  .replace(/^['"]|['"]$/g, '');   // strip surrounding quotes

if (!SK || !SK.startsWith('sk_')) {
  console.error('❌ STRIPE_SECRET_KEY missing/invalid (expected sk_...)');
}

const stripe = new Stripe(SK, { apiVersion: '2024-06-20' });

// One-time validation so you see a clear error if the key is wrong
(async () => {
  try {
    const acct = await stripe.accounts.retrieve();
    console.log('[Stripe] account OK:', acct.id);
  } catch (e) {
    console.error('❌ Stripe key invalid:', e.message);
  }
})();

// Currencies with 2-decimal minor units
const TWO_DECIMAL = new Set(['usd','eur','gbp','cad','aud']);

// Helpers
const sanitizeCurrency = (cur = 'usd') => {
  const c = String(cur || '').toLowerCase();
  return TWO_DECIMAL.has(c) ? c : 'usd';
};

// Convert to integer cents
function toCents({ amountCents, amount }) {
  if (amountCents != null) {
    const n = Number(amountCents);
    return Number.isInteger(n) && n >= 50 ? n : null;
  }
  if (amount == null) return null;
  const cleaned = String(amount).replace(/\s/g, '').replace(/,/g, '').replace(/[^0-9.]/g, '');
  const dollars = parseFloat(cleaned);
  if (!Number.isFinite(dollars)) return null;
  const cents = Math.round(dollars * 100);
  return Number.isInteger(cents) && cents >= 50 ? cents : null;
}

// POST /api/payments/create-intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amountCents, amount, currency = 'usd', metadata } = req.body;

    console.log('[payments] request body:', {
      amountCents, amount, currency,
      meta: { email: metadata?.email, flightId: metadata?.flightId }
    });

    const cents = toCents({ amountCents, amount });
    if (!cents) {
      return res.status(400).json({
        error: 'Invalid amount. Send integer cents as "amountCents" (≥ 50) or a dollar string like "199.99" as "amount".'
      });
    }

    const cur = sanitizeCurrency(currency);
    const idemKey = req.get('Idempotency-Key') || undefined;

    console.log('[payments] creating PI with', { cents, currency: cur });

    const intent = await stripe.paymentIntents.create(
      {
        amount: cents,
        currency: cur,
        automatic_payment_methods: { enabled: true },
        receipt_email: metadata?.email || undefined,
        metadata: { source: 'airline-reservation-system', ...metadata }
      },
      idemKey ? { idempotencyKey: idemKey } : undefined
    );

    console.log('[payments] PI created:', intent.id);
    return res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (err) {
    console.error('Stripe create-intent error:', {
      type: err?.type, code: err?.code, message: err?.message, raw: err?.raw?.message
    });
    return res.status(500).json({
      error: process.env.NODE_ENV === 'production'
        ? 'Unable to create PaymentIntent'
        : `Unable to create PaymentIntent: ${err?.message || err?.raw?.message || 'unknown error'}`
    });
  }
});

// --- Webhook (unchanged) ---
async function handleStripeEvent(event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded for', event.data.object.id, event.data.object.metadata);
      break;
    case 'payment_intent.payment_failed':
      console.warn('Payment failed for', event.data.object.id, event.data.object.last_payment_error?.message);
      break;
    default:
      break;
  }
}

const webhook = [
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      let event;
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        const sig = req.headers['stripe-signature'];
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } else {
        event = JSON.parse(req.body.toString('utf8')); // dev only
      }
      await handleStripeEvent(event);
      res.json({ received: true });
    } catch (e) {
      console.error('Webhook error:', e?.message);
      res.sendStatus(400);
    }
  }
];

module.exports = { router, webhook };
