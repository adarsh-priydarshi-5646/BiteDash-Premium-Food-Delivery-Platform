// Response compression for faster data transfer
// Reduces bandwidth by 60-80% for JSON responses

import zlib from 'zlib';

export const compressionMiddleware = (req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  // Skip compression for small responses or non-compressible content
  const originalJson = res.json.bind(res);
  
  res.json = (data) => {
    const jsonString = JSON.stringify(data);
    
    // Only compress if response is larger than 1KB
    if (jsonString.length < 1024) {
      return originalJson(data);
    }

    // Check if client accepts gzip
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
