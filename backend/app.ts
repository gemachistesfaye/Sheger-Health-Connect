require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { generalLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');
const { auditMiddleware } = require('./middleware/audit');
const { AppError } = require('./utils/errors');
const { logger } = require('./utils/logger');

const app = express();

// Trust proxy (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Rate limiting
app.use(generalLimiter);

// Cookie parser
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Audit context middleware
app.use(auditMiddleware);

// CORS - only allow configured origins
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:8080'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const startTime = Date.now();

app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    message: 'Sheger Health Connect API is running.',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    memory: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
    },
    database: { status: 'unknown' } as any,
    environment: process.env.NODE_ENV || 'development',
  };

  try {
    const { sequelize } = require('./config/db');
    await sequelize.authenticate();
    healthCheck.database = {
      status: 'connected',
      dialect: sequelize.getDialect(),
      host: sequelize.config.host || 'localhost',
    };
  } catch (dbError) {
    healthCheck.status = 'degraded';
    healthCheck.database = {
      status: 'disconnected',
      error: dbError.message,
    };
  }

  const statusCode = healthCheck.status === 'ok' ? 200 : 503;
  res.set('Cache-Control', 'no-store');
  res.status(statusCode).json(healthCheck);
});

// Root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
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

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/records', medicalRecordRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Backward compatibility - keep old routes pointing to v1
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for unhandled errors
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
module.exports = app;
