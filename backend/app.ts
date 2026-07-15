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
const { corsOptions } = require('./config/cors');

const app = express();

app.set('trust proxy', 1);
app.use(requestId);
app.use(helmet());
app.use(securityHeaders);
app.use(requestTimeout(parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10)));
app.use(compression());
app.use(generalLimiter);
app.use(cookieParser());
app.use(requestLogger);
app.use(auditMiddleware);
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.disable('x-powered-by');

const startTime = Date.now();

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
    database: { status: 'unknown' },
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
      pool: pool ? { size: pool.size, available: pool.available, waiting: pool.waiting } : null
    };
  } catch (dbError) {
    healthCheck.status = 'degraded';
    healthCheck.database = { status: 'disconnected', error: dbError.message };
  }

  const statusCode = healthCheck.status === 'ok' ? 200 : 503;
  res.set('Cache-Control', 'no-store');
  res.status(statusCode).json(healthCheck);
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Sheger Health Connect API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.send('<h2>Sheger Health Connect Backend is Live!</h2><p>The API is running properly. Please use the frontend application to interact with the system.</p>');
});

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const systemRoutes = require('./routes/systemRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/records', medicalRecordRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/system', systemRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/system', systemRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.originalUrl, method: req.method });
});

app.use((err, req, res, _next) => {
  logger.error({ error: err.message, stack: err.stack, requestId: req.requestId, method: req.method, url: req.originalUrl, ip: req.ip });

  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message, requestId: req.requestId });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors, requestId: req.requestId });
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', requestId: req.requestId });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    requestId: req.requestId
  });
});

module.exports = app;
