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

// All auth routes have stricter rate limiting (20 req/min)
authRouter.post("/signup", authRateLimiter, signUp);
authRouter.post("/signin", authRateLimiter, signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", authRateLimiter, sendOtp);
authRouter.post("/verify-otp", authRateLimiter, verifyOtp);
authRouter.post("/reset-password", authRateLimiter, resetPassword);
authRouter.post("/google-auth", authRateLimiter, googleAuth);

export default authRouter;
