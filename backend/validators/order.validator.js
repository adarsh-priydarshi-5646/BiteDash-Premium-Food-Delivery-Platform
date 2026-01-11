/**
 * Order Validators - Input validation for order endpoints
 *
 * Functions: validatePlaceOrder, validateUpdateStatus, validateDeliveryOtp
 * Validates: cart items, delivery address, payment method, status values
 * Returns array of error messages, empty if valid
 */

export const validatePlaceOrder = (data) => {
  const errors = [];

  if (!data.cartItems || !Array.isArray(data.cartItems) || data.cartItems.length === 0) {
    errors.push('Cart cannot be empty');
  }

  if (!data.deliveryAddress) {
    errors.push('Delivery address is required');
  } else {
    if (!data.deliveryAddress.text) {
      errors.push('Address text is required');
    }
    if (!data.deliveryAddress.latitude || !data.deliveryAddress.longitude) {
      errors.push('Address coordinates are required');
    }
  }

  if (!data.paymentMethod || !['cod', 'online'].includes(data.paymentMethod)) {
    errors.push('Invalid payment method');
  }

  if (!data.totalAmount || data.totalAmount <= 0) {
    errors.push('Invalid total amount');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateOrderStatus = (status) => {
  const validStatuses = [
    'pending',
    'accepted',
    'preparing',
    'ready',
    'out of delivery',
    'delivered',
    'cancelled',
  ];
  return validStatuses.includes(status);
};

export const validateRating = (rating) => {
  return rating && rating >= 1 && rating <= 5;
};

export const validateCartItem = (item) => {
  return item.id && item.name && item.price > 0 && item.quantity > 0 && item.shop;
};

export default {
  validatePlaceOrder,
  validateOrderStatus,
  validateRating,
  validateCartItem,
};
