const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize } = require('./config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// CORS origins for Socket.io
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:8080'];

// Initialize Socket.io with authentication
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
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

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} (User: ${socket.userId})`);

  // Join personal room using authenticated userId
  socket.join(`user_${socket.userId}`);
  console.log(`User ${socket.userId} joined room user_${socket.userId}`);

  if (socket.userRole === 'Doctor') {
    socket.join('group_staff');
    console.log(`Doctor ${socket.userId} joined clinical staff group room`);
  }

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
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
    try {
      await sequelize.close();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database:', err);
    }
    
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

// Connect to Database and sync models
connectDB().then(() => {
  // Use sync() without alter in production to prevent data loss
  // Use sync({ alter: true }) only in development
  const syncOptions = process.env.NODE_ENV === 'production' 
    ? { alter: false } 
    : { alter: true };
    
  sequelize.sync(syncOptions).then(() => {
    console.log('Models synced.');
    server.listen(PORT, () => {
      console.log(`Sheger Health Connect Backend running on port ${PORT}`);
    });
  });
});
