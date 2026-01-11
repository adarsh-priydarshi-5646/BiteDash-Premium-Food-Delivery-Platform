/**
 * Frontend Constants - Centralized config & magic values
 * 
 * Categories: API endpoints, app config, regex patterns, storage keys
 * Order statuses, payment methods, user roles
 * Prevents hardcoded values scattered across components
 */

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGN_UP: '/api/auth/signup',
  SIGN_IN: '/api/auth/signin',
  SIGN_OUT: '/api/auth/signout',
  SEND_OTP: '/api/auth/send-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  RESET_PASSWORD: '/api/auth/reset-password',
  GOOGLE_AUTH: '/api/auth/google',
  
  // User
  GET_CURRENT_USER: '/api/user/get-current-user',
  UPDATE_LOCATION: '/api/user/update-location',
  UPDATE_PROFILE: '/api/user/update-profile',
  
  // Shop
  GET_MY_SHOP: '/api/shop/get-my-shop',
  GET_SHOPS_BY_CITY: '/api/shop/get-shops-by-city',
  CREATE_SHOP: '/api/shop/create-shop',
  UPDATE_SHOP: '/api/shop/update-shop',
  
  // Items
  GET_ITEMS_BY_CITY: '/api/item/get-items-by-city',
  SEARCH_ITEMS: '/api/item/search-items',
  ADD_ITEM: '/api/item/add-item',
  UPDATE_ITEM: '/api/item/update-item',
  DELETE_ITEM: '/api/item/delete-item',
  
  // Orders
  PLACE_ORDER: '/api/order/place-order',
  GET_MY_ORDERS: '/api/order/get-my-orders',
  GET_ORDER_BY_ID: '/api/order/get-order',
  UPDATE_ORDER_STATUS: '/api/order/update-status',
  CANCEL_ORDER: '/api/order/cancel-order',
  RATE_ORDER: '/api/order/rate-order',
  
  // Delivery
  GET_ASSIGNMENTS: '/api/order/get-assignments',
  ACCEPT_ORDER: '/api/order/accept-order',
  GET_CURRENT_ORDER: '/api/order/get-current-order',
  SEND_DELIVERY_OTP: '/api/order/send-delivery-otp',
  VERIFY_DELIVERY_OTP: '/api/order/verify-delivery-otp',
  GET_TODAY_DELIVERIES: '/api/order/get-today-deliveries',
  
  // Payment
  CREATE_PAYMENT_INTENT: '/api/order/create-payment-intent',
  VERIFY_PAYMENT: '/api/order/verify-payment',
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

// Order Status Labels (for UI)
export const ORDER_STATUS_LABELS = {
  pending: 'Order Placed',
  accepted: 'Order Accepted',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  'out of delivery': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Order Status Colors (for UI)
export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-purple-100 text-purple-800',
  'out of delivery': 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online',
};

// Food Types
export const FOOD_TYPES = {
  VEG: 'veg',
  NON_VEG: 'non-veg',
};

// Sort Options
export const SORT_OPTIONS = {
  POPULARITY: 'popularity',
  RATING: 'rating',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  DELIVERY_TIME: 'delivery-time',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'bitedash_cart',
  THEME: 'bitedash_theme',
  LOCATION: 'bitedash_location',
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'BiteDash',
  CURRENCY: '₹',
  DELIVERY_FEE: 30,
  TAX_RATE: 0.05, // 5%
  MIN_ORDER_AMOUNT: 100,
  MAX_CART_ITEMS: 50,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  ITEMS_PER_PAGE: 12,
};

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  ORDER_PLACED: 'Order placed successfully!',
  ITEM_ADDED: 'Item added to cart',
  ITEM_REMOVED: 'Item removed from cart',
  PROFILE_UPDATED: 'Profile updated successfully',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  OTP: /^\d{4}$/,
  PASSWORD: /^.{6,}$/,
};
