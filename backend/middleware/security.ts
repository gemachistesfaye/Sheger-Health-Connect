import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const generateRequestId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id = (req.headers['x-request-id'] as string) || generateRequestId();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
};

export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.setTimeout(timeoutMs, () => {
      res.status(408).json({
        success: false,
        message: 'Request timeout',
      });
    });
    next();
  };
};

export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};
