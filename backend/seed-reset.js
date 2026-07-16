const { logger } = require('./utils/logger');
const bcrypt = require('bcrypt');
const { sequelize } = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

async function seedDatabase() {
  try {
    logger.info('🔄 Connecting to database...');
    await sequelize.authenticate();
    logger.info('✅ Database connected');

    // Sync models (force: true will drop and recreate tables)
    logger.info('🔄 Syncing database schema...');
    await sequelize.sync({ force: true });
    logger.info('✅ Database schema synced');

    // Delete all existing users
    logger.info('🗑️  Deleting all existing users...');
    await User.destroy({ where: {} });
    logger.info('✅ All users deleted');

    // Create Admin account
    logger.info('👤 Creating Admin account...');
    const adminPassword = 'Admin@2026';
    const salt = await bcrypt.genSalt(12);
    const adminPasswordHash = await bcrypt.hash(adminPassword, salt);

    const admin = await User.create({
      full_name: 'System Admin',
      username: 'admin',
      email: 'admin@sheger.care',
      phone: '0911223344',
      password_hash: adminPasswordHash,
      role: 'Admin',
      isVerified: true
    });

    logger.info('✅ Admin account created successfully!');
    logger.info('');
    logger.info('═══════════════════════════════════════════');
    logger.info('   ADMIN LOGIN CREDENTIALS');
    logger.info('═══════════════════════════════════════════');
    logger.info('   Username: admin');
    logger.info('   Password: Admin@2026');
    logger.info('═══════════════════════════════════════════');
    logger.info('');
    logger.info('⚠️  IMPORTANT: Change this password after first login!');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
