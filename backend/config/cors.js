const getAllowedOrigins = () => {
  if (!process.env.ALLOWED_ORIGINS && !process.env.FRONTEND_URL) {
    return ['http://localhost:5173', 'http://localhost:8080'];
  }
  const raw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL;
  return raw.split(',').map(url => url.trim().replace(/\/$/, ''));
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      // In production, reject requests with no origin for state-changing methods
      if (process.env.NODE_ENV === 'production') {
        return callback(null, false);
      }
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
};

module.exports = { allowedOrigins, corsOptions };
