/**
 * Auth Routes - User authentication & password recovery endpoints
 * 
 * Endpoints: /signup, /signin, /signout, /send-otp, /verify-otp, /reset-password, /google
 * Features: Rate limiting on auth endpoints (5 req/min), OTP-based password reset
 * All routes are public except signout which requires authentication
 */
import express from "express";
import { authRateLimiter } from "../middlewares/rateLimiter.js";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", authRateLimiter, signUp);
authRouter.post("/signin", authRateLimiter, signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", authRateLimiter, sendOtp);
authRouter.post("/verify-otp", authRateLimiter, verifyOtp);
authRouter.post("/reset-password", authRateLimiter, resetPassword);
authRouter.post("/google-auth", authRateLimiter, googleAuth);

export default authRouter;
