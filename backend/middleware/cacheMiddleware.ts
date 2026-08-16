import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Cache configuration: stdTTL is the default time-to-live in seconds
// checkperiod is the interval for checking and deleting expired keys
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Middleware to cache API responses
 * @param durationInSeconds - Cache duration in seconds
 */
export const cacheMiddleware = (durationInSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = apiCache.get(key);

    if (cachedBody) {
      logger.debug(`Cache hit for ${key}`);
      res.set('X-Cache', 'HIT');
      res.status(200).json(cachedBody);
      return;
    }

    logger.debug(`Cache miss for ${key}`);
    res.set('X-Cache', 'MISS');

    // Override res.json to intercept and cache the response body
    const originalJson = res.json.bind(res);
    res.json = function (body: unknown) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        apiCache.set(key, body, durationInSeconds);
      }
      return originalJson(body);
    };

    next();
  };
};
