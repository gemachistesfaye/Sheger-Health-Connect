import rateLimit from 'express-rate-limit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let RedisStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redisClient: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rateLimitRedis = require('rate-limit-redis');
  RedisStore = rateLimitRedis.default || rateLimitRedis;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Redis = require('ioredis');
  redisClient = new Redis(
    process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`
  );
} catch {
  // Redis not available - use default in-memory store
}

const limiterOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  ...(redisClient && RedisStore
    ? {
        store: new RedisStore({
          sendCommand: (...args: string[]) => redisClient!.call(...args),
        }),
      }
    : {}),
};

export const generalLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_GENERAL || '100', 10),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

export const authLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_AUTH || '10', 10),
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
});

export const loginLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_LOGIN || '5', 10),
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
});

export const passwordResetLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET || '3', 10),
  message: {
    success: false,
    message: 'Too many password reset requests, please try again after 15 minutes',
  },
});

export const emailVerifyLimiter = rateLimit({
  ...limiterOptions,
  max: 10,
  message: {
    success: false,
    message: 'Too many verification attempts, please try again after 15 minutes',
  },
});

export const aiLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_AI || '20', 10),
  message: {
    success: false,
    message: 'Too many AI requests, please try again after 15 minutes',
  },
});

export const contactLimiter = rateLimit({
  ...limiterOptions,
  max: 5,
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again after 15 minutes',
  },
});
