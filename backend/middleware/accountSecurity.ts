import { sequelize } from '../config/db';
import { logger } from '../utils/logger';

// ─── Token Blacklist ─────────────────────────────────────────────────────────

export const initTokenBlacklist = async (): Promise<void> => {
  try {
    const [results] = await sequelize.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'TokenBlacklists')`
    );
    const exists = (results as Record<string, unknown>[])[0]?.exists as boolean;
    if (!exists) {
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
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err.message }, 'Token blacklist table creation failed, using in-memory fallback');
  }
};

const tokenBlacklistMemory = new Set<string>();

export const blacklistToken = async (token: string, expiresAt?: Date): Promise<void> => {
  try {
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query(
        'INSERT INTO "TokenBlacklists" (token, expires_at) VALUES ($1, $2)',
        { replacements: [token, expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] }
      );
    } else {
      tokenBlacklistMemory.add(token);
    }
  } catch {
    tokenBlacklistMemory.add(token);
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    if (sequelize.getDialect() === 'postgres') {
      const [results] = await sequelize.query(
        'SELECT id FROM "TokenBlacklists" WHERE token = $1 AND expires_at > NOW()',
        { replacements: [token] }
      );
      return (results as unknown[]).length > 0;
    }
    return tokenBlacklistMemory.has(token);
  } catch {
    return tokenBlacklistMemory.has(token);
  }
};

const cleanupBlacklistedTokens = async (): Promise<void> => {
  try {
    if (sequelize.getDialect() === 'postgres') {
      await sequelize.query('DELETE FROM "TokenBlacklists" WHERE expires_at < NOW()');
    }
  } catch {
    /* silent */
  }
};

// ─── Account Lockout ─────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
const LOCK_TIME = parseInt(process.env.LOCK_TIME_MS || '900000', 10);

interface LockableUser {
  lockUntil: Date | null;
  loginAttempts: number;
  update(attributes: Record<string, unknown>, options?: Record<string, unknown>): Promise<unknown>;
}

export const isAccountLocked = (user: LockableUser): boolean => {
  return !!(user.lockUntil && user.lockUntil.getTime() > Date.now());
};

export const handleFailedLogin = async (user: LockableUser): Promise<void> => {
  const updates: Record<string, unknown> = {};
  const attempts =
    !user.lockUntil || user.lockUntil.getTime() < Date.now() ? 1 : user.loginAttempts + 1;
  updates.loginAttempts = attempts;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    updates.lockUntil = new Date(Date.now() + LOCK_TIME);
  }
  await user.update(updates);
};

export const resetLoginAttempts = async (user: LockableUser): Promise<void> => {
  if (user.loginAttempts > 0 || user.lockUntil) {
    await user.update({ loginAttempts: 0, lockUntil: null });
  }
};

// Cleanup interval (runs every hour)
setInterval(cleanupBlacklistedTokens, 60 * 60 * 1000);

export { MAX_LOGIN_ATTEMPTS, LOCK_TIME };
