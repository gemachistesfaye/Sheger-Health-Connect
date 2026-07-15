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

// General rate limiter: configurable, default 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_GENERAL, 10) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Strict rate limiter for auth: configurable, default 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_AUTH, 10) || 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  }
});

// Login specific: configurable, default 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_LOGIN, 10) || 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  }
});

// Password reset: configurable, default 3 requests per 15 minutes per IP
const passwordResetLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET, 10) || 3,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again after 15 minutes'
  }
});

// Email verification: 10 requests per 15 minutes per IP
const emailVerifyLimiter = rateLimit({
  ...limiterOptions,
  max: 10,
  message: {
    success: false,
    message: 'Too many verification attempts, please try again after 15 minutes'
  }
});

// AI chat: configurable, default 20 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  ...limiterOptions,
  max: parseInt(process.env.RATE_LIMIT_AI, 10) || 20,
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
  emailVerifyLimiter,
  aiLimiter
};
