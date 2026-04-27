/**
 * Redis Cache Configuration
 * In-memory caching for frequently accessed data
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, value);
    
    if (ttlSeconds > 0) {
      const expiryTime = Date.now() + (ttlSeconds * 1000);
      this.ttl.set(key, expiryTime);
      
      setTimeout(() => {
        this.delete(key);
      }, ttlSeconds * 1000);
    }
  }

  get(key) {
    if (this.ttl.has(key)) {
      const expiryTime = this.ttl.get(key);
      if (Date.now() > expiryTime) {
        this.delete(key);
        return null;
      }
    }
    
    return this.cache.get(key) || null;
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  has(key) {
    if (this.ttl.has(key)) {
      const expiryTime = this.ttl.get(key);
      if (Date.now() > expiryTime) {
        this.delete(key);
        return false;
      }
    }
    return this.cache.has(key);
  }

  size() {
    return this.cache.size;
  }
}

const cache = new CacheService();

export default cache;
