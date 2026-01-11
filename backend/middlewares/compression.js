/**
 * Compression Middleware - Gzip compression for API responses
 * 
 * Compresses JSON responses larger than 1KB using zlib
 * Checks Accept-Encoding header for gzip support
 * Reduces bandwidth usage, improves response times
 */
import zlib from 'zlib';

export const compressionMiddleware = (req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const originalJson = res.json.bind(res);
  
  res.json = (data) => {
    const jsonString = JSON.stringify(data);
    
    if (jsonString.length < 1024) {
      return originalJson(data);
    }

    if (acceptEncoding.includes('gzip')) {
      zlib.gzip(jsonString, (err, compressed) => {
        if (err) {
          return originalJson(data);
        }
        
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', compressed.length);
        res.end(compressed);
      });
    } else {
      return originalJson(data);
    }
  };

  next();
};
