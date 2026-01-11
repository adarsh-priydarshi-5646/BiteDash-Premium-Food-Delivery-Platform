/**
 * Stripe Config - Payment gateway initialization
 *
 * Initializes Stripe SDK with secret key from environment
 * Returns null if STRIPE_SECRET_KEY not configured (COD only mode)
 * Used for checkout sessions and payment verification
 */
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export default stripe;
