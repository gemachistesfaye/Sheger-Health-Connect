const { Sequelize } = require('sequelize');
const path = require('path');

let logger;
try {
  logger = require('../utils/logger').logger;
} catch {
  logger = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    debug: (...args) => {},
    warn: (...args) => console.warn('[WARN]', ...args)
  };
}

const isProduction = process.env.NODE_ENV === 'production';

const validateEnv = () => {
  if (isProduction) {
    const required = ['DB_HOST', 'DB_USER', 'DB_PASS', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    if (process.env.USE_SQLITE === 'true') {
      throw new Error('SQLite is not allowed in production. Use PostgreSQL or MySQL.');
    }
  }
};

validateEnv();

const poolConfig = isProduction
  ? { max: 20, min: 5, acquire: 60000, idle: 30000 }
  : { max: 10, min: 2, acquire: 30000, idle: 10000 };

const determineDialect = () => {
  if (process.env.DB_DIALECT) return process.env.DB_DIALECT;
  if (process.env.DB_HOST) {
    if (process.env.DB_HOST.includes('supabase') || process.env.DB_HOST.includes('pooler')) return 'postgres';
    return 'mysql';
  }
  return process.env.USE_SQLITE === 'true' ? 'sqlite' : 'mysql';
};

const dialect = determineDialect();

const dbConfigs = {
  postgres: () => new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: isProduction ? false : (msg) => logger.debug(msg),
      pool: poolConfig,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      retry: { max: 5, match: [/ECONNREFUSED/, /ETIMEDOUT/, /EHOSTUNREACH/] }
    }
  ),
  sqlite: () => new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'sheger_health.sqlite'),
    logging: false
  }),
  mysql: () => new Sequelize(
    process.env.DB_NAME || 'sheger_health',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: isProduction ? false : (msg) => logger.debug(msg),
      pool: poolConfig,
      dialectOptions: (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') ? {
        ssl: { require: true, rejectUnauthorized: isProduction }
      } : {},
      retry: { max: 5, match: [/ECONNREFUSED/, /ETIMEDOUT/, /EHOSTUNREACH/] }
    }
  )
};

const createSequelizeInstance = () => {
  const factory = dbConfigs[dialect];
  if (!factory) throw new Error(`Unsupported database dialect: ${dialect}`);
  return factory();
};

const sequelize = createSequelizeInstance();

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info({ host: sequelize.config.host || 'local', pool: `${poolConfig.min}-${poolConfig.max}`, dialect }, 'Database connected');
  } catch (error) {
    logger.error(error, 'Unable to connect to the database');
    if (isProduction) process.exit(1);
    throw error;
  }
};

const closeDB = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error(error, 'Error closing database');
  }
};

module.exports = { sequelize, connectDB, closeDB };
