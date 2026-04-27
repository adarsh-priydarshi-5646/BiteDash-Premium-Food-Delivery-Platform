/**
 * Auth Validators - Input validation for auth endpoints
 *
 * Functions: validateSignUp, validateSignIn, validateResetPassword
 * Validates: email format, password length (6+), mobile digits (10+)
 * Returns array of error messages, empty if valid
 */

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSignUp = (data) => {
  const errors = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!data.mobile || data.mobile.length < 10) {
    errors.push('Mobile number must be at least 10 digits');
  }

  if (!data.role || !['user', 'owner', 'deliveryBoy'].includes(data.role)) {
    errors.push('Invalid role specified');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignIn = (data) => {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email');
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateOtp = (otp) => {
  return otp && otp.length === 4 && /^\d{4}$/.test(otp);
};

export const validateEmail = (email) => {
  return email && isValidEmail(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export default {
  validateSignUp,
  validateSignIn,
  validateOtp,
  validateEmail,
  validatePassword,
};
