const User = require('../models/User');
const { sequelize } = require('../config/db');
const { logger } = require('../utils/logger');

const TokenBlacklist = null;

const initTokenBlacklist = async () => {
  try {
    const [results] = await sequelize.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'TokenBlacklists')`
    );
    if (!results[0].exists) {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "TokenBlacklists" (
          id SERIAL PRIMARY KEY,
          token VARCHAR(500) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_token_blacklist_token ON "TokenBlacklists" (token)`);
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires ON "TokenBlacklists" (expires_at)`);
      logger.info('Token blacklist table created');
    }
  } catch (error) {
    logger.error({ error: error.message }, 'Token blacklist table creation failed, using in-memory fallback');
  }
};

const tokenBlacklistMemory = new Set();

const blacklistToken = async (token, expiresAt) => {
  try {
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query(
        'INSERT INTO "TokenBlacklists" (token, expires_at) VALUES ($1, $2)',
        [token, expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
      );
    } else {
      tokenBlacklistMemory.add(token);
    }
  } catch {
    tokenBlacklistMemory.add(token);
  }
};

const isTokenBlacklisted = async (token) => {
  try {
    if (sequelize.getDialect() === 'postgres') {
      const [results] = await sequelize.query(
        'SELECT id FROM "TokenBlacklists" WHERE token = $1 AND expires_at > NOW()',
        [token]
      );
      return results.length > 0;
    }
    return tokenBlacklistMemory.has(token);
  } catch {
    return tokenBlacklistMemory.has(token);
  }
};

const cleanupBlacklistedTokens = async () => {
  try {
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query('DELETE FROM "TokenBlacklists" WHERE expires_at < NOW()');
    }
  } catch { /* silent */ }
};

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
const LOCK_TIME = parseInt(process.env.LOCK_TIME_MS || '900000', 10);

const isAccountLocked = (user) => user.lockUntil && user.lockUntil > Date.now();

const handleFailedLogin = async (user) => {
  const updates = {};
  const attempts = (!user.lockUntil || user.lockUntil < Date.now()) ? 1 : user.loginAttempts + 1;
  updates.loginAttempts = attempts;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    updates.lockUntil = new Date(Date.now() + LOCK_TIME);
  }
  await user.update(updates);
};

const resetLoginAttempts = async (user) => {
  if (user.loginAttempts > 0 || user.lockUntil) {
    await user.update({ loginAttempts: 0, lockUntil: null });
  }
};

setInterval(cleanupBlacklistedTokens, 60 * 60 * 1000);

module.exports = {
  blacklistToken, isTokenBlacklisted, isAccountLocked, handleFailedLogin,
  resetLoginAttempts, initTokenBlacklist, MAX_LOGIN_ATTEMPTS, LOCK_TIME
};
