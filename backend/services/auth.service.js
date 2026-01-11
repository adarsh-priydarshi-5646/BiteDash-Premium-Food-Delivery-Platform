/**
 * Auth Service - Authentication business logic layer
 * 
 * Functions: createUser, validateCredentials, generateOtp, verifyOtp, resetPassword
 * Separates business logic from controllers for testability
 * Uses bcrypt for hashing, JWT for tokens, SendGrid for OTP emails
 */
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import genToken from '../utils/token.js';
import { sendOtpMailSendGrid } from '../utils/sendgridMail.js';
import { OTP_CONFIG, COOKIE_CONFIG } from '../constants/index.js';

/**
 * Generate OTP for verification
 */
export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate auth token and set cookie
 */
export const generateAuthToken = async (userId) => {
  return await genToken(userId);
};

/**
 * Get cookie options based on environment
 */
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: COOKIE_CONFIG.MAX_AGE,
    httpOnly: COOKIE_CONFIG.HTTP_ONLY,
  };
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Find user by ID
 */
export const findUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  const hashedPassword = userData.password 
    ? await hashPassword(userData.password) 
    : undefined;
  
  return await User.create({
    ...userData,
    password: hashedPassword,
  });
};

/**
 * Save OTP to user record
 */
export const saveOtpToUser = async (user, otp) => {
  user.resetOtp = otp;
  user.otpExpires = Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000;
  user.isOtpVerified = false;
  await user.save();
};

/**
 * Verify OTP for user
 */
export const verifyUserOtp = async (user, otp) => {
  if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
    return false;
  }
  
  user.isOtpVerified = true;
  user.resetOtp = undefined;
  user.otpExpires = undefined;
  await user.save();
  
  return true;
};

/**
 * Reset user password
 */
export const resetUserPassword = async (user, newPassword) => {
  if (!user || !user.isOtpVerified) {
    return false;
  }
  
  user.password = await hashPassword(newPassword);
  user.isOtpVerified = false;
  await user.save();
  
  return true;
};

/**
 * Send OTP via email
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    await sendOtpMailSendGrid(email, otp);
    return true;
  } catch (error) {
    console.error('SendGrid failed:', error.message);
    return false;
  }
};

export default {
  generateOtp,
  hashPassword,
  comparePassword,
  generateAuthToken,
  getCookieOptions,
  findUserByEmail,
  findUserById,
  createUser,
  saveOtpToUser,
  verifyUserOtp,
  resetUserPassword,
  sendOtpEmail,
};
