const { Sequelize } = require('sequelize');
const path = require('path');

// Automatically default to SQLite if USE_SQLITE is 'true' OR if connecting to the expired Aiven cloud host
const isSqlite = process.env.USE_SQLITE === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')) || !process.env.DB_HOST;

const sequelize = isSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'sheger_health.sqlite'),
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME || 'sheger_health',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'production' ? false : console.log,
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000
        },
        dialectOptions: (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') ? {
          ssl: {
            require: true,
            rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false
          }
        } : {}
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(isSqlite ? '✅ SQLite Database connected successfully.' : '✅ MySQL Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
