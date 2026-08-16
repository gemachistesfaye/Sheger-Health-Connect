import cors, { CorsOptions } from 'cors';

const getAllowedOrigins = (): string[] => {
  if (!process.env.ALLOWED_ORIGINS && !process.env.FRONTEND_URL) {
    return ['http://localhost:5173', 'http://localhost:8080'];
  }
  const raw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL;
  return raw!.split(',').map((url: string) => url.trim().replace(/\/$/, ''));
};

export const allowedOrigins: string[] = getAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
    if (!origin) {
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
