require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:8080'] 
    : ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sheger Health Connect API is running.' });
});

// Root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('<h2>Sheger Health Connect Backend is Live!</h2><p>The API is running properly. Please use the frontend application to interact with the system.</p>');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
