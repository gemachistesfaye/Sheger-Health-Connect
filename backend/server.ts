require('dotenv').config();
const app = require('./app');
const http = require('http');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize, closeDB } = require('./config/db');
const { initTokenBlacklist } = require('./middleware/accountSecurity');
const { allowedOrigins } = require('./config/cors');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

const metrics = { startTime: Date.now(), requests: 0, errors: 0 };

app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid
  });
});

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await closeDB();
    logger.info('Graceful shutdown complete.');
    process.exit(0);
  });
  setTimeout(() => { logger.error('Forced shutdown after timeout.'); process.exit(1); }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason, promise) => logger.error({ promise, reason }, 'Unhandled Rejection'));
process.on('uncaughtException', (err) => { logger.error(err, 'Uncaught Exception'); gracefulShutdown('uncaughtException'); });

const startServer = async () => {
  try {
    await connectDB();
    await initTokenBlacklist();
    const syncOptions = process.env.NODE_ENV === 'production' ? { alter: false } : { alter: true };
    await sequelize.sync(syncOptions);
    logger.info('Models synced');

    server.listen(PORT, HOST, () => {
      logger.info({ port: PORT, host: HOST, env: process.env.NODE_ENV || 'development', pid: process.pid }, 'ShegerHealth Backend running');
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
