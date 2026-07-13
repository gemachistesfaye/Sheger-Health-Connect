import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import sendEmail from '../utils/emailService';
import { isAccountLocked, handleFailedLogin, resetLoginAttempts } from '../middleware/accountSecurity';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export class AuthService {
  static generateToken(id: number, role: string): string {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    } as any);
  }

  static generateRefreshToken(id: number): string {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    } as any);
  }

  static async register(data: any) {
    const { full_name, username, email, phone, password, role, specialization } = data;

    if (!full_name || !username || !password) {
      throw new BadRequestError('Please provide required fields (full_name, username, password)');
    }

    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestError('Username is already taken');
    }

    if (email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        throw new BadRequestError('Email is already registered');
      }
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      full_name,
      username,
      email,
      phone,
      password_hash,
      role: role || 'Patient',
      specialization
    });

    logger.info(`User registered successfully: ${user.username}`);

    const accessToken = this.generateToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);
    
    await user.update({ refreshToken });

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    };
  }

  static async login(data: any) {
    const { username, password } = data;

    if (!username || !password) {
      throw new BadRequestError('Please provide username and password');
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }

    if (isAccountLocked(user)) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenError(`Account is locked. Try again in ${remainingTime} minutes.`);
    }

    if (user.banned) {
      throw new ForbiddenError('Your account has been banned by the administrator.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await handleFailedLogin(user);
      throw new UnauthorizedError('Invalid username or password');
    }

    await resetLoginAttempts(user);
    logger.info(`User logged in successfully: ${user.username}`);

    const accessToken = this.generateToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    await user.update({ refreshToken });

    return {
      user, // Returning user to handle audit log in controller
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
      }
    };
  }

  static async refreshToken(incomingToken: string) {
    if (!incomingToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    try {
      const decoded: any = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET as string);
      const user = await User.findByPk(decoded.id);

      if (!user || user.refreshToken !== incomingToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      if (user.banned) {
        throw new ForbiddenError('Account banned');
      }

      const accessToken = this.generateToken(user.id, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      await user.update({ refreshToken });

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('There is no user with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ resetPasswordToken, resetPasswordExpire });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you requested a password reset. Make a PUT request to: \n\n ${resetUrl}`;
    const htmlMessage = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `;

    try {
      await sendEmail({ email: user.email, subject: 'Password reset token', message, html: htmlMessage });
      logger.info(`Password reset email sent to: ${user.email}`);
    } catch (err) {
      logger.error(`Error sending email to ${user.email}`, err);
      // @ts-ignore
      await user.update({ resetPasswordToken: null, resetPasswordExpire: null });
      throw new Error('Email could not be sent');
    }
  }

  static async resetPassword(resettoken: string, password: string) {
    const resetPasswordToken = crypto.createHash('sha256').update(resettoken).digest('hex');
    const user = await User.findOne({ where: { resetPasswordToken } });

    if (!user || user.resetPasswordExpire < new Date()) {
      throw new BadRequestError('Invalid token or token expired');
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const accessToken = this.generateToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    await user.update({
      password_hash,
      resetPasswordToken: null,
      resetPasswordExpire: null,
      refreshToken
    } as any);

    logger.info(`User reset password successfully: ${user.username}`);

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    };
  }
}
