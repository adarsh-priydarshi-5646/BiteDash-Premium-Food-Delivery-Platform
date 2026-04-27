import express from 'express';
import passport from 'passport';
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
import genToken from '../utils/token.js';

const authRouter = express.Router();

authRouter.post('/signup', authRateLimiter, signUp);
authRouter.post('/signin', authRateLimiter, signIn);
authRouter.get('/signout', signOut);
authRouter.post('/send-otp', authRateLimiter, sendOtp);
authRouter.post('/verify-otp', authRateLimiter, verifyOtp);
authRouter.post('/reset-password', authRateLimiter, resetPassword);
authRouter.post('/google-auth', authRateLimiter, googleAuth);

// Google OAuth routes
authRouter.get(
  '/google',
  (req, res, next) => {
    const { mobile, role } = req.query;
    const state = JSON.stringify({ mobile, role });
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
    })(req, res, next);
  }
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/signin` }),
  async (req, res) => {
    try {
      const token = await genToken(req.user._id);
      
      res.cookie('token', token, {
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/',
      });

      res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=auth_failed`);
    }
  }
);

export default authRouter;
