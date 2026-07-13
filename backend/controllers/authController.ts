import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { AUDIT_ACTIONS } from '../middleware/audit';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, ...userData } = await AuthService.register(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ success: true, data: userData });
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
      httpOnly: true
    });
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      path: '/api/v1/auth/refresh'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
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
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    next(error);
  }
};
