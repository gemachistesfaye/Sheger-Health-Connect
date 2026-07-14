require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { generalLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');
const { auditMiddleware } = require('./middleware/audit');
const { requestId, securityHeaders, requestTimeout } = require('./middleware/security');
const { AppError } = require('./utils/errors');
const { logger } = require('./utils/logger');

const app = express();

// Trust proxy (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Request ID (must be first)
app.use(requestId);

// Security headers
app.use(helmet());
app.use(securityHeaders);

// Request timeout (30 seconds)
app.use(requestTimeout(30000));

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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Disable fingerprinting
app.disable('x-powered-by');

const startTime = Date.now();

// Enhanced health check
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    message: 'Sheger Health Connect API is running.',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
    },
    database: { status: 'unknown' } as any,
    checks: {
      cpu: process.cpuUsage(),
      activeHandles: process._getActiveHandles().length,
      activeRequests: process._getActiveRequests().length
    }
  };

  try {
    const { sequelize } = require('./config/db');
    await sequelize.authenticate();
    const pool = sequelize.connectionManager?.pool;
    healthCheck.database = {
      status: 'connected',
      dialect: sequelize.getDialect(),
      host: sequelize.config.host || 'localhost',
      pool: pool ? {
        size: pool.size,
        available: pool.available,
        waiting: pool.waiting
      } : null
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

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Sheger Health Connect API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// Root route
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
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  // Log error with request context
  logger.error({
    error: err.message,
    stack: err.stack,
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  // Operational errors (expected)
  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      requestId: req.requestId
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
      requestId: req.requestId
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      requestId: req.requestId
    });
  }

  // Fallback for unhandled errors
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    requestId: req.requestId
  });
});

export default app;
module.exports = app;
