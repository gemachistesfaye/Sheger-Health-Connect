import 'dotenv/config';
import app from './app';
import http from 'http';
import jwt from 'jsonwebtoken';
import { connectDB, sequelize, closeDB } from './config/db';
import { initTokenBlacklist } from './middleware/accountSecurity';
import { allowedOrigins } from './config/cors';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

const metrics = { startTime: Date.now(), requests: 0, errors: 0 };

app.get('/api/metrics', (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid
  }));
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await closeDB();
    logger.info('Graceful shutdown complete.');
    process.exit(0);
  });
  setTimeout(() => { logger.error(new Error('Forced shutdown after timeout.'), 'Forced shutdown after timeout.'); process.exit(1); }, 30000);
};

process.on('SIGTERM', () => { void gracefulShutdown('SIGTERM'); });
process.on('SIGINT', () => { void gracefulShutdown('SIGINT'); });
process.on('unhandledRejection', (reason, promise) => { logger.error({ promise, reason: reason as Error }, 'Unhandled Rejection'); });
process.on('uncaughtException', (err) => { logger.error(err, 'Uncaught Exception'); void gracefulShutdown('uncaughtException'); });

const startServer = async (): Promise<void> => {
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
    logger.error(error as Error, 'Failed to start server');
    process.exit(1);
  }
};

void startServer();
