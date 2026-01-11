// Sanitize user input for safe regex usage
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Sanitize for MongoDB queries
export const sanitizeQuery = (input) => {
  if (typeof input !== 'string') return '';
  // Remove potential NoSQL injection characters
  return input.replace(/[${}]/g, '');
};
