const bcrypt = require('bcrypt');
const { sequelize } = require('./config/db');
const { logger } = require('./utils/logger');
require('dotenv').config();

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected for seeding');

    const username = 'admin';
    const password = process.env.ADMIN_PASSWORD || 'Admin@2026';
    const full_name = 'System Admin';
    const email = 'admin@sheger.care';
    const phone = '0911223344';
    const role = 'Admin';

    const [results] = await sequelize.query('SELECT id FROM "Users" WHERE username = ?', [username]);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    if (results.length > 0) {
      logger.info('Admin exists, updating password');
      await sequelize.query('UPDATE "Users" SET password_hash = ?, role = ? WHERE username = ?', [hash, role, username]);
    } else {
      logger.info('Creating new Admin user');
      await sequelize.query(
        'INSERT INTO "Users" (full_name, username, email, phone, password_hash, role, "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [full_name, username, email, phone, hash, role]
      );
    }

    logger.info('Admin account seeded successfully');
  } catch (error) {
    logger.error(error, 'Error seeding admin');
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
