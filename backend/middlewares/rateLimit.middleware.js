/**
 * Rate Limiter - Sliding window algorithm for API protection
 *
 * In-memory storage with auto-cleanup every 30 seconds
 * Configurable limits: auth (5/min), search (30/min), orders (10/min), general (100/min)
 * Replace with Redis for distributed/multi-instance deployments
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.WINDOW_MS = 60 * 1000;
    setInterval(() => this.cleanup(), 30 * 1000);
  }

  isAllowed(key, maxRequests) {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return { allowed: true, remaining: maxRequests - 1 };
    }

    const timestamps = this.requests.get(key);
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= maxRequests) {
      const oldestInWindow = Math.min(...validTimestamps);
      const retryAfter = Math.ceil((oldestInWindow + this.WINDOW_MS - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    return { allowed: true, remaining: maxRequests - validTimestamps.length };
  }

  cleanup() {
    const windowStart = Date.now() - this.WINDOW_MS;
    for (const [key, timestamps] of this.requests.entries()) {
      const valid = timestamps.filter((t) => t > windowStart);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }
  }
}

const limiter = new RateLimiter();

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const result = limiter.isAllowed(`api:${ip}`, 200);

  res.setHeader('X-RateLimit-Remaining', result.remaining);

  if (!result.allowed) {
    res.setHeader('Retry-After', result.retryAfter);
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: result.retryAfter,
    });
  }

  next();
};

export const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const result = limiter.isAllowed(`auth:${ip}`, 20);

  if (!result.allowed) {
    return res.status(429).json({
      error: 'Too many login attempts. Please try again later.',
      retryAfter: result.retryAfter,
    });
  }

  next();
};

export const orderRateLimiter = (req, res, next) => {
  const userId = req.userId || req.ip;
  const result = limiter.isAllowed(`order:${userId}`, 30);

  if (!result.allowed) {
    return res.status(429).json({
      error: 'Order limit reached. Please wait before placing another order.',
      retryAfter: result.retryAfter,
    });
  }

  next();
};

export const searchRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const result = limiter.isAllowed(`search:${ip}`, 60);

  if (!result.allowed) {
    return res.status(429).json({
      error: 'Search limit reached. Please slow down.',
      retryAfter: result.retryAfter,
    });
  }

  next();
};
