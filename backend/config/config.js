module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './sheger_health.sqlite',
    logging: console.log
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 30000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
