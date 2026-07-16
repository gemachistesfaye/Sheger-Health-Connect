require('dotenv').config();
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize, closeDB } = require('./config/db');
const { initTokenBlacklist } = require('./middleware/accountSecurity');
const { allowedOrigins } = require('./config/cors');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true },
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || '60000', 10),
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10),
  transports: ['websocket', 'polling']
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
});

app.set('io', io);

let connectionCount = 0;

io.on('connection', (socket) => {
  connectionCount++;
  logger.info({ socketId: socket.id, userId: socket.userId, total: connectionCount }, 'Client connected');
  socket.join(`user_${socket.userId}`);
  if (socket.userRole === 'Doctor') socket.join('group_staff');

  socket.on('typing', (data) => {
    socket.to(`user_${data.receiverId}`).emit('userTyping', { userId: socket.userId, isTyping: data.isTyping });
  });

  socket.on('disconnect', (reason) => {
    connectionCount--;
    logger.info({ socketId: socket.id, reason, total: connectionCount }, 'Client disconnected');
  });

  socket.on('error', (error) => {
    logger.error({ socketId: socket.id, error: error.message }, 'Socket error');
  });
});

const metrics = { startTime: Date.now(), requests: 0, errors: 0 };

app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
    connections: connectionCount,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid
  });
});

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    io.close(() => logger.info('Socket.io connections closed.'));
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
      logger.info({ port: PORT, host: HOST, env: process.env.NODE_ENV || 'development', pid: process.pid }, 'Sheger Health Connect Backend running');
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
