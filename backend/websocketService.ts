require('dotenv').config();
import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from './utils/logger';

const PORT = process.env.WS_PORT || 5001;
const HOST = process.env.WS_HOST || '0.0.0.0';
const INTERNAL_SECRET = process.env.WS_INTERNAL_SECRET || 'super-secret-internal-key-123';
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true },
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || '60000', 10),
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10),
  transports: ['websocket', 'polling']
});

// Auth middleware for sockets
io.use((socket: any, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
});

let connectionCount = 0;

io.on('connection', (socket: any) => {
  connectionCount++;
  logger.info({ socketId: socket.id, userId: socket.userId, total: connectionCount }, 'WS Client connected');
  
  socket.join(`user_${socket.userId}`);
  if (socket.userRole === 'Doctor') socket.join('group_staff');

  socket.on('typing', (data: any) => {
    socket.to(`user_${data.receiverId}`).emit('userTyping', { userId: socket.userId, isTyping: data.isTyping });
  });

  socket.on('disconnect', (reason: string) => {
    connectionCount--;
    logger.info({ socketId: socket.id, reason, total: connectionCount }, 'WS Client disconnected');
  });

  socket.on('error', (error: Error) => {
    logger.error({ socketId: socket.id, error: error.message }, 'WS Socket error');
  });
});

// Internal Webhook Endpoint for main REST API to trigger emissions
app.post('/internal/emit', (req: Request, res: Response): any => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${INTERNAL_SECRET}`) {
    return res.status(403).json({ success: false, message: 'Unauthorized internal call' });
  }

  const { room, event, payload } = req.body;
  
  if (!room || !event) {
    return res.status(400).json({ success: false, message: 'Missing room or event' });
  }

  io.to(room).emit(event, payload);
  logger.info({ room, event }, 'Internal emit successful');
  
  res.json({ success: true });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    connections: connectionCount,
    uptime: process.uptime()
  });
});

server.listen(PORT as number, HOST, () => {
  logger.info({ port: PORT, host: HOST }, 'ShegerHealth WebSocket Microservice running');
});
