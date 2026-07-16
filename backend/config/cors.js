const getAllowedOrigins = () => {
  if (!process.env.FRONTEND_URL) {
    return ['http://localhost:5173', 'http://localhost:8080'];
  }
  // Split by comma, trim whitespace, and remove trailing slashes
  return process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''));
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Strip trailing slash from origin just in case
    const cleanOrigin = origin.replace(/\/$/, '');
    
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    
    console.warn(`[CORS Blocked] Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
};

module.exports = { allowedOrigins, corsOptions };
