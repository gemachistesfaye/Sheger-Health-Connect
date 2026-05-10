const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sheger_health'
  });

  const full_name = 'System Admin';
  const username = 'admin';
  const email = 'admin@sheger.care';
  const phone = '0911223344';
  const password = 'Admin@2026';
  const role = 'Admin';

  try {
    // Check if exists
    const [rows] = await connection.execute('SELECT id FROM Users WHERE username = ?', [username]);
    if (rows.length > 0) {
      console.log('Admin user already exists. Updating password...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await connection.execute('UPDATE Users SET password_hash = ?, role = ? WHERE username = ?', [hash, role, username]);
    } else {
      console.log('Creating new Admin user...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await connection.execute(
        'INSERT INTO Users (full_name, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
        [full_name, username, email, phone, hash, role]
      );
    }
    console.log('✅ Admin account seeded successfully!');
    console.log('Username: admin');
    console.log('Password: Admin@2026');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  } finally {
    await connection.end();
  }
}

seedAdmin();
