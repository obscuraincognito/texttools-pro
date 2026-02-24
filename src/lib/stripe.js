import Stripe from 'stripe';

let stripeInstance = null;

export function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
    }
    stripeInstance = new Stripe(key, { apiVersion: '2024-04-10' });
  }
  return stripeInstance;
}
