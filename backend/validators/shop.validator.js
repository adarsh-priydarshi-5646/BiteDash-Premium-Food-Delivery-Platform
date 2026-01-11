/**
 * Shop Validators - Input validation for shop endpoints
 * 
 * Functions: validateCreateShop, validateUpdateShop
 * Validates: shop name, city, state, address fields
 * Returns array of error messages, empty if valid
 */

export const validateCreateShop = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Shop name must be at least 2 characters');
  }
  
  if (!data.address || data.address.trim().length < 5) {
    errors.push('Please provide a valid address');
  }
  
  if (!data.city) {
    errors.push('City is required');
  }
  
  if (!data.state) {
    errors.push('State is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateItem = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Item name must be at least 2 characters');
  }
  
  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (!data.category) {
    errors.push('Category is required');
  }
  
  if (!data.foodType || !['veg', 'non-veg'].includes(data.foodType)) {
    errors.push('Food type must be veg or non-veg');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateCreateShop,
  validateItem,
};
