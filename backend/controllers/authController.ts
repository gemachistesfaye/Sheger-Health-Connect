import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { AUDIT_ACTIONS } from '../middleware/audit';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  // Parse JWT_EXPIRES_IN to get cookie maxAge (default 15 minutes)
  const accessExpiryMs = 15 * 60 * 1000; // 15 minutes
  const refreshExpiryMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: accessExpiryMs
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth/refresh',
    maxAge: refreshExpiryMs
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.verifyEmail(req.params.token as string);
    res.status(200).json({ success: true, data: result, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { user, data } = await AuthService.login(req.body);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.USER_LOGIN, {
        targetId: user.id,
        targetType: 'User',
        metadata: { username: user.username, role: user.role }
      });
    }

    const { accessToken, refreshToken, ...userData } = data;
    setAuthCookies(res, accessToken, refreshToken);
    // SECURITY: Do not return tokens in response body - use HttpOnly cookies only
    res.json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getMe(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    const { accessToken, refreshToken } = await AuthService.refreshToken(token);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ success: true, message: 'Tokens refreshed' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('accessToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSocketToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Generate a short-lived token specifically for Socket.io connections
    // This token expires in 1 hour and is separate from the main access token
    const socketToken = require('jsonwebtoken').sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.json({ success: true, data: { token: socketToken } });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, ...userData } = await AuthService.resetPassword(req.params.resettoken as string, req.body.password);
    setAuthCookies(res, accessToken, refreshToken);
    // SECURITY: Do not return tokens in response body - use HttpOnly cookies only
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};
