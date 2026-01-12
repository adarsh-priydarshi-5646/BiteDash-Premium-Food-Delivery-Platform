/**
 * Stripe Config - Payment gateway initialization
 *
 * Initializes Stripe SDK with secret key, returns null if not configured
 * 
 * Libraries: stripe
 * Env: STRIPE_SECRET_KEY (starts with sk_test or sk_live prefix)
 * Use cases: Create checkout sessions, verify payments, handle webhooks
 * Fallback: COD (Cash on Delivery) if Stripe not configured
 */
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export default stripe;
