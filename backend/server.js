const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, sequelize } = require('./config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL 
      ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:8080'] 
      : ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST']
  }
});

// Make io accessible to route controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Allow clients to join their personal room by userId
  socket.on('join', (payload) => {
    const userId = typeof payload === 'object' ? payload.userId : payload;
    const role = typeof payload === 'object' ? payload.role : null;

    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined room user_${userId}`);

    if (role === 'Doctor') {
      socket.join('group_staff');
      console.log(`🏥 Doctor ${userId} joined clinical staff group room`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Connect to Database and sync models
connectDB().then(() => {
  sequelize.sync({ alter: true }).then(() => {
    console.log('✅ MySQL Models synced.');
    server.listen(PORT, () => {
      console.log(`🚀 Sheger Health Connect Backend running on port ${PORT}`);
    });
  });
});
