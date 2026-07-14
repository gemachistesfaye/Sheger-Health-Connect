const { Sequelize } = require('sequelize');
const path = require('path');
const { logger } = require('../utils/logger');

const validateEnv = () => {
  if (process.env.NODE_ENV === 'production') {
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

const isPostgres = process.env.DB_HOST && (
  process.env.DB_HOST.includes('supabase') ||
  process.env.DB_HOST.includes('pooler') ||
  process.env.DB_DIALECT === 'postgres'
);
const isProduction = process.env.NODE_ENV === 'production';
const isSqlite = !isPostgres && (process.env.USE_SQLITE === 'true' || !process.env.DB_HOST);

const poolConfig = isProduction
  ? { max: 20, min: 5, acquire: 60000, idle: 30000 }
  : { max: 10, min: 2, acquire: 30000, idle: 10000 };

let sequelize;

if (isPostgres) {
  sequelize = new Sequelize(
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
  );
} else if (isSqlite && !isProduction) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'sheger_health.sqlite'),
    logging: false
  });
} else {
  sequelize = new Sequelize(
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
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    const dbType = isPostgres ? 'PostgreSQL' : isSqlite ? 'SQLite' : 'MySQL';
    logger.info({ host: sequelize.config.host || 'local', pool: `${poolConfig.min}-${poolConfig.max}`, dialect: dbType }, 'Database connected');
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
