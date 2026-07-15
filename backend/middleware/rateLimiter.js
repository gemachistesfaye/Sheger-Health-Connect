const rateLimit = require('express-rate-limit');

let RedisStore, redisClient;

try {
  RedisStore = require('rate-limit-redis');
  const Redis = require('ioredis');
  redisClient = new Redis(process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`);
} catch {
  // Redis not available - use default in-memory store
}

const limiterOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  ...(redisClient ? {
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args)
    })
  } : {})
};

// General rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  ...limiterOptions,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Strict rate limiter for auth: 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  ...limiterOptions,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  }
});

// Login specific: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  ...limiterOptions,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  }
});

// Password reset: 3 requests per 15 minutes per IP
const passwordResetLimiter = rateLimit({
  ...limiterOptions,
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again after 15 minutes'
  }
});

// AI chat: 20 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  ...limiterOptions,
  max: 20,
  message: {
    success: false,
    message: 'Too many AI requests, please try again after 15 minutes'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  aiLimiter
};
