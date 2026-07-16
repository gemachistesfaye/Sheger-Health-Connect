const NodeCache = require('node-cache');
const { logger } = require('../utils/logger');

// Cache configuration: stdTTL is the default time-to-live in seconds
// checkperiod is the interval for checking and deleting expired keys
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Middleware to cache API responses
 * @param {number} durationInSeconds - Cache duration in seconds
 */
const cacheMiddleware = (durationInSeconds) => {
  return (req, res, next) => {
    // We only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Use the original URL as the cache key
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = apiCache.get(key);

    if (cachedBody) {
      logger.debug(`Cache hit for ${key}`);
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedBody);
    } else {
      logger.debug(`Cache miss for ${key}`);
      res.set('X-Cache', 'MISS');
      
      // Override res.json to intercept and cache the response body
      const originalJson = res.json;
      res.json = function (body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          apiCache.set(key, body, durationInSeconds);
        }
        originalJson.call(this, body);
      };
      
      next();
    }
  };
};

/**
 * Utility to clear cache for specific routes
 * @param {string} prefix - The route prefix to clear (e.g., "/api/v1/doctors")
 */
const clearCache = (prefix) => {
  const keys = apiCache.keys();
  const keysToDelete = keys.filter(key => key.includes(prefix));
  if (keysToDelete.length > 0) {
    apiCache.del(keysToDelete);
    logger.debug(`Cleared ${keysToDelete.length} cache entries for ${prefix}`);
  }
};

module.exports = { cacheMiddleware, clearCache };
