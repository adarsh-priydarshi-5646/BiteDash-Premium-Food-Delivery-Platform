/**
 * Application Constants - Centralized config & magic values
 * 
 * Categories: HTTP status codes, order statuses, OTP config, cookie settings
 * Geo config: Max distance for delivery boy search (10km)
 * Prevents magic numbers scattered across codebase
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  OWNER: 'owner',
  DELIVERY_BOY: 'deliveryBoy',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out of delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online',
};

// Delivery Assignment Status
export const ASSIGNMENT_STATUS = {
  BROADCASTED: 'brodcasted',
  ASSIGNED: 'assigned',
  COMPLETED: 'completed',
};

// Cookie Configuration
export const COOKIE_CONFIG = {
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  HTTP_ONLY: true,
};

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 4,
  EXPIRY_MINUTES: 5,
};

// Geolocation
export const GEO_CONFIG = {
  MAX_DELIVERY_DISTANCE: 10000, // 10km in meters
  NEARBY_DISTANCE: 5000, // 5km in meters
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Food Types
export const FOOD_TYPES = {
  VEG: 'veg',
  NON_VEG: 'non-veg',
};

// Error Messages
export const ERROR_MESSAGES = {
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User does not exist',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_OTP: 'Invalid or expired OTP',
  ORDER_NOT_FOUND: 'Order not found',
  SHOP_NOT_FOUND: 'Shop not found',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
  PASSWORD_RESET: 'Password reset successfully',
  ORDER_PLACED: 'Order placed successfully',
  ORDER_DELIVERED: 'Order delivered successfully',
};
