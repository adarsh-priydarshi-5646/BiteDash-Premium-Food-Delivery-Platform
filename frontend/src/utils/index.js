/**
 * Frontend Utilities - Reusable helper functions
 *
 * Functions: formatCurrency, formatDate, validateEmail, validateMobile
 * Storage helpers: getFromStorage, setToStorage, removeFromStorage
 * Used across components for consistent formatting & validation
 */

import { APP_CONFIG, REGEX, STORAGE_KEYS } from '../constants';

/**
 * Format currency with Indian Rupee symbol
 */
export const formatCurrency = (amount) => {
  return `${APP_CONFIG.CURRENCY}${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate time ago (e.g., "5 mins ago")
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return formatDate(date);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return REGEX.EMAIL.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone) => {
  return REGEX.PHONE.test(phone);
};

/**
 * Validate OTP format
 */
export const isValidOtp = (otp) => {
  return REGEX.OTP.test(otp);
};

/**
 * Validate password (min 6 chars)
 */
export const isValidPassword = (password) => {
  return REGEX.PASSWORD.test(password);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculate cart total
 */
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Calculate order total with delivery fee and tax
 */
export const calculateOrderTotal = (subtotal) => {
  const deliveryFee = APP_CONFIG.DELIVERY_FEE;
  const tax = subtotal * APP_CONFIG.TAX_RATE;
  return {
    subtotal,
    deliveryFee,
    tax: Math.round(tax),
    total: Math.round(subtotal + deliveryFee + tax),
  };
};

/**
 * Save to local storage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage save error:', error);
    return false;
  }
};

/**
 * Get from local storage
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue;
  }
};

/**
 * Remove from local storage
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Storage remove error:', error);
    return false;
  }
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return !obj || Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  timeAgo,
  isValidEmail,
  isValidPhone,
  isValidOtp,
  isValidPassword,
  truncateText,
  capitalize,
  getInitials,
  calculateCartTotal,
  calculateOrderTotal,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  debounce,
  generateId,
  isEmpty,
  deepClone,
  groupBy,
};
