const { Sequelize } = require('sequelize');
const path = require('path');

// Determine database type: PostgreSQL (Supabase), MySQL, or SQLite
const isPostgres = process.env.DB_HOST && process.env.DB_HOST.includes('supabase');
const isSqlite = process.env.USE_SQLITE === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')) || (!process.env.DB_HOST && !isPostgres);

let sequelize;

if (isPostgres) {
  // Supabase PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'production' ? false : console.log,
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
} else if (isSqlite) {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'sheger_health.sqlite'),
    logging: false
  });
} else {
  // MySQL
  sequelize = new Sequelize(
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
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    const dbType = isPostgres ? 'PostgreSQL (Supabase)' : isSqlite ? 'SQLite' : 'MySQL';
    console.log(`✅ ${dbType} Database connected successfully.`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
