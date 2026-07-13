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

// Connect to Database and sync models
connectDB().then(() => {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Models synced.');
    server.listen(PORT, () => {
      console.log(`Sheger Health Connect Backend running on port ${PORT}`);
    });
  });
});
