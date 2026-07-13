const {
  isAccountLocked,
  handleFailedLogin,
  resetLoginAttempts,
  blacklistToken,
  isTokenBlacklisted,
  MAX_LOGIN_ATTEMPTS,
  LOCK_TIME
} = require('../accountSecurity');

describe('Account Security Middleware', () => {
  describe('isAccountLocked', () => {
    it('should return false for user without lockUntil', () => {
      const user = { lockUntil: null };
      expect(isAccountLocked(user)).toBeFalsy();
    });

    it('should return false for user with past lockUntil', () => {
      const user = { lockUntil: Date.now() - 1000 };
      expect(isAccountLocked(user)).toBeFalsy();
    });

    it('should return true for user with future lockUntil', () => {
      const user = { lockUntil: Date.now() + 10000 };
      expect(isAccountLocked(user)).toBeTruthy();
    });
  });

  describe('handleFailedLogin', () => {
    it('should increment loginAttempts', async () => {
      const user = { loginAttempts: 0, lockUntil: null, update: async (updates) => { Object.assign(user, updates); } };
      await handleFailedLogin(user);
      expect(user.loginAttempts).toBe(1);
    });

    it('should set lockUntil after max attempts', async () => {
      const user = { loginAttempts: 4, lockUntil: null, update: async (updates) => { Object.assign(user, updates); } };
      await handleFailedLogin(user);
      expect(user.loginAttempts).toBe(1);
      expect(user.lockUntil).toBeDefined();
      expect(new Date(user.lockUntil).getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('resetLoginAttempts', () => {
    it('should reset loginAttempts to 0', async () => {
      const user = { loginAttempts: 3, lockUntil: Date.now() + 10000, update: async (updates) => { Object.assign(user, updates); } };
      await resetLoginAttempts(user);
      expect(user.loginAttempts).toBe(0);
      expect(user.lockUntil).toBeNull();
    });

    it('should not call update if no attempts', async () => {
      let updateCalled = false;
      const user = { loginAttempts: 0, lockUntil: null, update: async () => { updateCalled = true; } };
      await resetLoginAttempts(user);
      expect(updateCalled).toBe(false);
    });
  });

  describe('blacklistToken', () => {
    it('should add token to blacklist', () => {
      blacklistToken('test-token-123');
      expect(isTokenBlacklisted('test-token-123')).toBe(true);
    });

    it('should return false for non-blacklisted token', () => {
      expect(isTokenBlacklisted('nonexistent-token')).toBe(false);
    });
  });

  describe('constants', () => {
    it('should have correct MAX_LOGIN_ATTEMPTS', () => {
      expect(MAX_LOGIN_ATTEMPTS).toBe(5);
    });

    it('should have correct LOCK_TIME', () => {
      expect(LOCK_TIME).toBe(15 * 60 * 1000);
    });
  });
});
