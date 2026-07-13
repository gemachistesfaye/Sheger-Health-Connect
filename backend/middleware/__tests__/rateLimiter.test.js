const {
  generalLimiter,
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  aiLimiter
} = require('../rateLimiter');

describe('Rate Limiter Middleware', () => {
  it('should export all rate limiters', () => {
    expect(generalLimiter).toBeDefined();
    expect(authLimiter).toBeDefined();
    expect(loginLimiter).toBeDefined();
    expect(passwordResetLimiter).toBeDefined();
    expect(aiLimiter).toBeDefined();
  });

  it('should be a function (middleware)', () => {
    expect(typeof generalLimiter).toBe('function');
    expect(typeof authLimiter).toBe('function');
    expect(typeof loginLimiter).toBe('function');
    expect(typeof passwordResetLimiter).toBe('function');
    expect(typeof aiLimiter).toBe('function');
  });

  it('should have resetKey and getKey methods', () => {
    expect(typeof generalLimiter.resetKey).toBe('function');
    expect(typeof generalLimiter.getKey).toBe('function');
  });
});
