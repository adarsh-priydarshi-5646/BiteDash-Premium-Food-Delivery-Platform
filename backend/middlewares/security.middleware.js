/**
 * Security Middleware - HTTP headers & request sanitization
 *
 * Headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy
 * Features: Removes X-Powered-By, limits request body size, sanitizes input
 * Protects against clickjacking, MIME sniffing, XSS attacks
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * Sanitizes input to prevent NoSQL injection
 */
export const sanitizeRequest = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

export const requestSizeLimiter = (maxSizeKB = 100) => {
  return (req, res, next) => {
    let size = 0;

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxSizeKB * 1024) {
        res.status(413).json({ error: 'Request too large' });
        req.destroy();
      }
    });

    next();
  };
};
