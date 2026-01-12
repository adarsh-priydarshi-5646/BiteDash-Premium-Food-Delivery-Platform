/**
 * Auth Routes - User authentication & password recovery
 *
 * Endpoints: POST /signup, /signin, /signout, /send-otp, /verify-otp, 
 * /reset-password, /google
 * 
 * Libraries: express, rate-limiter middleware
 * Middleware: authRateLimiter (5 requests/min per IP)
 * Features: JWT auth, OTP-based password reset, Google OAuth
 * Public routes: All except /signout (requires auth)
 */
import express from 'express';
import { authRateLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signup', authRateLimiter, signUp);
authRouter.post('/signin', authRateLimiter, signIn);
authRouter.get('/signout', signOut);
authRouter.post('/send-otp', authRateLimiter, sendOtp);
authRouter.post('/verify-otp', authRateLimiter, verifyOtp);
authRouter.post('/reset-password', authRateLimiter, resetPassword);
authRouter.post('/google-auth', authRateLimiter, googleAuth);

export default authRouter;
