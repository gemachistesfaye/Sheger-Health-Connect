const User = require('../models/User');

// In-memory blacklist (use Redis in production)
const tokenBlacklist = new Set();

// Blacklist a token
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Account lockout configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Check if account is locked
const isAccountLocked = (user) => {
  return user.lockUntil && user.lockUntil > Date.now();
};

// Handle failed login attempt
const handleFailedLogin = async (user) => {
  const updates = {};
  
  if (!user.lockUntil || user.lockUntil < Date.now()) {
    updates.loginAttempts = 1;
    updates.lockUntil = new Date(Date.now() + LOCK_TIME);
  } else {
    updates.loginAttempts = user.loginAttempts + 1;
    if (updates.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockUntil = new Date(Date.now() + LOCK_TIME);
    }
  }
  
  await user.update(updates);
};

// Reset login attempts on successful login
const resetLoginAttempts = async (user) => {
  if (user.loginAttempts > 0 || user.lockUntil) {
    await user.update({ loginAttempts: 0, lockUntil: null });
  }
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
  isAccountLocked,
  handleFailedLogin,
  resetLoginAttempts,
  MAX_LOGIN_ATTEMPTS,
  LOCK_TIME
};
