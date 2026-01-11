// Centralized error handler to prevent information exposure
export const handleError = (res, error, context = 'operation') => {
  // Log full error for debugging (server-side only)
  console.error(`${context} error:`, error);
  
  // Return generic message to client (no stack trace exposure)
  return res.status(500).json({ 
    message: `An error occurred during ${context}. Please try again.` 
  });
};

// For validation errors (400)
export const handleValidationError = (res, message) => {
  return res.status(400).json({ message });
};

// For not found errors (404)
export const handleNotFoundError = (res, resource = 'Resource') => {
  return res.status(404).json({ message: `${resource} not found` });
};

// For unauthorized errors (401/403)
export const handleAuthError = (res, message = 'Unauthorized') => {
  return res.status(401).json({ message });
};
