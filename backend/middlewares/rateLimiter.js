// Simple in-memory rate limiter for high load protection
const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute per IP

// Cleanup old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.startTime > WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}, WINDOW_MS);

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, startTime: now });
    return next();
  }
  
  const data = requestCounts.get(ip);
  
  if (now - data.startTime > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, startTime: now });
    return next();
  }
  
  if (data.count >= MAX_REQUESTS) {
    return res.status(429).json({ 
      error: "Too many requests, please try again later",
      retryAfter: Math.ceil((WINDOW_MS - (now - data.startTime)) / 1000)
    });
  }
  
  data.count++;
  next();
};

// Stricter limiter for auth routes
export const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `auth_${ip}`;
  const now = Date.now();
  const AUTH_MAX = 10; // 10 auth attempts per minute
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, { count: 1, startTime: now });
    return next();
  }
  
  const data = requestCounts.get(key);
  
  if (now - data.startTime > WINDOW_MS) {
    requestCounts.set(key, { count: 1, startTime: now });
    return next();
  }
  
  if (data.count >= AUTH_MAX) {
    return res.status(429).json({ 
      error: "Too many login attempts, please try again later"
    });
  }
  
  data.count++;
  next();
};
