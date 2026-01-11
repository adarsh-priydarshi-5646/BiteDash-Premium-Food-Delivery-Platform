/**
 * Error Handler Utils - Standardized error response helpers
 * 
 * handleError: Logs error and returns generic 500 response
 * Prevents stack trace exposure in production
 * Provides consistent error format across all endpoints
 */
export const handleError = (res, error, context = 'operation') => {
  console.error(`${context} error:`, error);
  return res.status(500).json({ 
    message: `An error occurred during ${context}. Please try again.` 
  });
};

export const handleValidationError = (res, message) => {
  return res.status(400).json({ message });
};

export const handleNotFoundError = (res, resource = 'Resource') => {
  return res.status(404).json({ message: `${resource} not found` });
};

export const handleAuthError = (res, message = 'Unauthorized') => {
  return res.status(401).json({ message });
};
