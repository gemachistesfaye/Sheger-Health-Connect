/* eslint-disable no-duplicate-imports */
export {};

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      role: string;
      username?: string;
      full_name?: string;
      email?: string;
    };
    auditLog?: (action: string, details?: Record<string, unknown>) => void;
  }
}

declare module '../models/User' {
  import { Model } from 'sequelize';
  interface UserModel extends Model {
    id: number;
    full_name: string;
    username: string;
    email: string | null;
    phone: string | null;
    password_hash: string;
    role: string;
    specialization: string | null;
    isVerified: boolean;
    banned: boolean;
    refreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpire: Date | null;
    verificationToken: string | null;
    verificationExpire: Date | null;
    lockUntil: Date;
    loginAttempts: number;
  }
  const User: any;
  export default User;
}

declare module '../utils/emailService' {
  interface EmailOptions {
    email: string;
    subject: string;
    message: string;
    html?: string;
  }
  const sendEmail: (options: EmailOptions) => Promise<void>;
  export default sendEmail;
}

declare module '../utils/emailTemplates' {
  interface EmailTemplate {
    subject: string;
    html: string;
  }
  const emailTemplates: {
    verification: (name: string, token: string) => EmailTemplate;
    welcomeVerified: (name: string) => EmailTemplate;
    passwordReset: (name: string, token: string) => EmailTemplate;
    appointmentConfirmation: (name: string, date: string) => EmailTemplate;
    doctorOnboard: (name: string, email: string, password: string) => EmailTemplate;
  };
  export default emailTemplates;
}

declare module '../middleware/accountSecurity' {
  import { UserModel } from '../models/User';
  export function isAccountLocked(user: UserModel): boolean;
  export function handleFailedLogin(user: UserModel): Promise<void>;
  export function resetLoginAttempts(user: UserModel): Promise<void>;
  export function initTokenBlacklist(): Promise<void>;
  export function blacklistToken(token: string, expiresAt: Date): Promise<void>;
  export function isTokenBlacklisted(token: string): Promise<boolean>;
}

declare module '../middleware/audit' {
  import { Request, Response, NextFunction } from 'express';
  export const AUDIT_ACTIONS: Record<string, string>;
  export function auditMiddleware(req: Request, res: Response, next: NextFunction): void;
  export function logAudit(params: {
    userId?: number;
    action: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}

declare module '../middleware/logger' {
  import { Request, Response, NextFunction } from 'express';
  export function requestLogger(req: Request, res: Response, next: NextFunction): void;
}

declare module '../middleware/security' {
  import { Request, Response, NextFunction } from 'express';
  export function requestId(req: Request, res: Response, next: NextFunction): void;
  export function securityHeaders(req: Request, res: Response, next: NextFunction): void;
  export function requestTimeout(ms: number): (req: Request, res: Response, next: NextFunction) => void;
}



declare module '../config/db' {
  export const sequelize: any;
  export const connectDB: () => Promise<void>;
  export const closeDB: () => Promise<void>;
}

declare module '../config/cors' {
  export const corsOptions: any;
  export const allowedOrigins: string[];
}

declare module '../middleware/rateLimiter' {
  export const generalLimiter: any;
  export const authLimiter: any;
  export const emailVerifyLimiter: any;
}
