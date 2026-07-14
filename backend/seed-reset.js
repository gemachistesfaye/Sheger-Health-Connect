const bcrypt = require('bcrypt');
const { sequelize } = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models (force: true will drop and recreate tables)
    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ force: true });
    console.log('✅ Database schema synced');

    // Delete all existing users
    console.log('🗑️  Deleting all existing users...');
    await User.destroy({ where: {} });
    console.log('✅ All users deleted');

    // Create Admin account
    console.log('👤 Creating Admin account...');
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

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('   ADMIN LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════');
    console.log('   Username: admin');
    console.log('   Password: Admin@2026');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
