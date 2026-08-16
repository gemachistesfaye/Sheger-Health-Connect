import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { isTokenBlacklisted } from './accountSecurity';
import { AuthenticatedUser, JwtPayload } from '../types';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.cookies && req.cookies.accessToken) {
    try {
      token = req.cookies.accessToken;

      const blacklisted = await isTokenBlacklisted(token);
      if (blacklisted) {
        res.status(401).json({ success: false, message: 'Token has been revoked' });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] },
      });

      if (!user) {
        res.status(401).json({ success: false, message: 'User no longer exists' });
        return;
      }

      if (user.banned) {
        res.status(403).json({ success: false, message: 'Account has been banned' });
        return;
      }

      req.user = {
        id: user.id,
        role: user.role as AuthenticatedUser['role'],
        username: user.username,
        full_name: user.full_name,
        email: user.email,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ success: false, message: 'Token expired' });
        return;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ success: false, message: 'Invalid token' });
        return;
      }
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
