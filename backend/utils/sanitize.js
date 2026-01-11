/**
 * Input Sanitization - Security utilities for user input
 * 
 * escapeRegex: Escapes special regex chars to prevent ReDoS attacks
 * sanitizeQuery: Removes NoSQL injection patterns from queries
 * sanitizeHtml: Strips dangerous HTML tags for XSS prevention
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const sanitizeQuery = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[${}]/g, '');
};
