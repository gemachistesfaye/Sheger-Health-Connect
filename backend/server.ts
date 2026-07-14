const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize, closeDB } = require('./config/db');
const { initTokenBlacklist } = require('./middleware/accountSecurity');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

// CORS origins for Socket.io
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:8080'];

// Initialize Socket.io with authentication
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
});

// Make io accessible to route controllers
app.set('io', io);

// Connection tracking
let connectionCount = 0;

io.on('connection', (socket) => {
  connectionCount++;
  console.log(`Client connected: ${socket.id} (User: ${socket.userId}) | Total: ${connectionCount}`);

  // Join personal room using authenticated userId
  socket.join(`user_${socket.userId}`);

  if (socket.userRole === 'Doctor') {
    socket.join('group_staff');
  }

  // Handle real-time events
  socket.on('typing', (data) => {
    socket.to(`user_${data.receiverId}`).emit('userTyping', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', (reason) => {
    connectionCount--;
    console.log(`Client disconnected: ${socket.id} (${reason}) | Total: ${connectionCount}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error.message);
  });
});

// Track server metrics
const metrics = {
  startTime: Date.now(),
  requests: 0,
  errors: 0
};

// Metrics endpoint
app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
    connections: connectionCount,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid
  });
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed.');
    
    // Close Socket.io connections
    io.close(() => {
      console.log('Socket.io connections closed.');
    });
    
    // Close database connection
    await closeDB();
    
    console.log('Graceful shutdown complete.');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize token blacklist
    await initTokenBlacklist();
    
    // Sync models (use migrations in production)
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false } 
      : { alter: true };
      
    await sequelize.sync(syncOptions);
    console.log('✅ Models synced');
    
    // Start listening
    server.listen(PORT, HOST, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('   Sheger Health Connect Backend');
      console.log('═══════════════════════════════════════════');
      console.log(`   Status:    Running`);
      console.log(`   Port:      ${PORT}`);
      console.log(`   Host:      ${HOST}`);
      console.log(`   Mode:      ${process.env.NODE_ENV || 'development'}`);
      console.log(`   PID:       ${process.pid}`);
      console.log('═══════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
