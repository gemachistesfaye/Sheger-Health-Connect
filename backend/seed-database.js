require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // 1. Connect to Aiven Database
    await connectDB();
    await sequelize.sync({ alter: true });

    // 2. Wipe the existing Users table to start fresh
    console.log('🗑️  Wiping existing users data...');
    await User.destroy({ where: {} }); // Deletes all rows
    console.log('✅ Database wiped clean.');

    // 3. Create passwords
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('Password@123', salt);

    // 4. Create Admin Account
    console.log('👨‍💻 Creating Admin Account...');
    await User.create({
      full_name: 'System Administrator',
      username: 'admin',
      email: 'admin@sheger.care',
      phone: '0911000000',
      password_hash: await bcrypt.hash('Admin@2026', salt),
      role: 'Admin'
    });

    // 5. Create 3 Doctor Accounts
    console.log('🩺 Creating 3 Doctor Accounts...');
    await User.bulkCreate([
      {
        full_name: 'Dr. Abebe Bekele',
        username: 'dr_abebe',
        email: 'abebe@sheger.care',
        phone: '0911111111',
        password_hash,
        role: 'Doctor',
        specialization: 'Cardiologist'
      },
      {
        full_name: 'Dr. Sarah Tesfaye',
        username: 'dr_sarah',
        email: 'sarah@sheger.care',
        phone: '0922222222',
        password_hash,
        role: 'Doctor',
        specialization: 'Pediatrician'
      },
      {
        full_name: 'Dr. Dawit Tadesse',
        username: 'dr_dawit',
        email: 'dawit@sheger.care',
        phone: '0933333333',
        password_hash,
        role: 'Doctor',
        specialization: 'Neurologist'
      },
      {
        full_name: 'Selam Girma',
        username: 'patient_selam',
        email: 'selam@sheger.care',
        phone: '0944444444',
        password_hash,
        role: 'Patient'
      }
    ]);

    console.log('🎉 SEEDING COMPLETE! You can now log in.');
    console.log('--------------------------------------------------');
    console.log('Admin Login -> Username: admin | Password: Admin@2026');
    console.log('Doctor Logins -> Usernames: dr_abebe, dr_sarah, dr_dawit | Password: Password@123');
    console.log('--------------------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
