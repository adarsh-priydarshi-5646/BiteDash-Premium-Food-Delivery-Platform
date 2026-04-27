/**
 * Input Sanitization - Security utilities for user input
 *
 * Functions:
 * - escapeRegex: Escapes special regex chars to prevent ReDoS attacks
 * - sanitizeQuery: Removes NoSQL injection patterns from queries
 * - sanitizeHtml: Strips dangerous HTML tags for XSS prevention
 * 
 * Used in: item search, user input validation, form submissions
 */

export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const sanitizeQuery = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[${}]/g, '');
};

export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  return sanitized;
};
