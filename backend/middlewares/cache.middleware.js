/**
 * Cache Middleware
 * Caches GET requests to reduce database load
 */

import cache from '../config/cache.js';

export const cacheMiddleware = (ttlSeconds = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log(`Cache HIT: ${key}`);
      return res.json(cachedData);
    }

    console.log(`Cache MISS: ${key}`);

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (data) => {
      cache.set(key, data, ttlSeconds);
      return originalJson(data);
    };

    next();
  };
};

export const clearCache = (pattern) => {
  if (pattern) {
    // Clear specific cache pattern
    console.log(`Clearing cache pattern: ${pattern}`);
  } else {
    // Clear all cache
    cache.clear();
    console.log('All cache cleared');
  }
};
