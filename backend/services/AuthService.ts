import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import sendEmail from '../utils/emailService';
import emailTemplates from '../utils/emailTemplates';
import { isAccountLocked, handleFailedLogin, resetLoginAttempts } from '../middleware/accountSecurity';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { RegisterInput, LoginInput, AuthenticatedUser } from '../types';

interface AuthServiceTokenPair {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResult {
  id: number;
  full_name: string;
  email: string | null;
  role: string;
  isVerified: boolean;
  message: string;
}

interface LoginResult {
  user: AuthenticatedUser;
  data: {
    id: number;
    full_name: string;
    email: string | null;
    role: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

interface ResetPasswordResult {
  id: number;
  full_name: string;
  email: string | null;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static generateToken(id: number, role: string): string {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    } as jwt.SignOptions);
  }

  static generateRefreshToken(id: number): string {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET as string), {
      expiresIn: '7d',
    } as jwt.SignOptions);
  }

  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async register(data: RegisterInput): Promise<RegisterResult> {
    const { full_name, username, email, phone, password, specialization } = data;

    const role = 'Patient' as const;

    if (!full_name || !username || !password) {
      throw new BadRequestError('Please provide required fields (full_name, username, password)');
    }

    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      if (!userExists.isVerified) {
        await userExists.destroy();
        logger.info(`Deleted unverified account for username: ${username}`);
      } else {
        throw new BadRequestError('Username is already taken');
      }
    }

    if (email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        if (!emailExists.isVerified) {
          await emailExists.destroy();
          logger.info(`Deleted unverified account for email: ${email}`);
        } else {
          throw new BadRequestError('Email is already registered');
        }
      }
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const verificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      full_name,
      username,
      email,
      phone,
      password_hash,
      role,
      specialization,
      verificationToken: hashedVerificationToken,
      verificationExpire,
      isVerified: false,
    });

    logger.info(`User registered successfully: ${user.username}`);

    if (email) {
      const template = emailTemplates.verification(full_name, verificationToken);
      sendEmail({
        email,
        subject: template.subject,
        message: `Please verify your email by visiting: ${process.env.FRONTEND_URL}/verify-email/${verificationToken}`,
        html: template.html,
      })
        .then(() => logger.info(`Verification email sent to: ${email}`))
        .catch((err: unknown) => logger.error({ email, err }, `Error sending verification email to ${email}`));
    }

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      message: email
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful.',
    };
  }

  static async verifyEmail(token: string): Promise<RegisterResult> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: { verificationToken: hashedToken },
    });

    if (!user) {
      throw new BadRequestError('Invalid verification token');
    }

    if (user.verificationExpire && user.verificationExpire < new Date()) {
      throw new BadRequestError('Verification token has expired');
    }

    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationExpire: null,
    });

    try {
      const template = emailTemplates.welcomeVerified(user.full_name);
      await sendEmail({
        email: user.email!,
        subject: template.subject,
        message: 'Your email has been verified. Welcome to ShegerHealth!',
        html: template.html,
      });
      logger.info(`Welcome email sent to: ${user.email}`);
    } catch (err: unknown) {
      logger.error({ email: user.email, err }, `Error sending welcome email to ${user.email}`);
    }

    logger.info(`Email verified for user: ${user.username}`);

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      message: 'Email verified successfully',
    };
  }

  static async login(data: LoginInput): Promise<LoginResult> {
    const { username, password } = data;

    if (!username || !password) {
      throw new BadRequestError('Please provide username and password');
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }

    if (isAccountLocked(user)) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenError(`Account is locked. Try again in ${remainingTime} minutes.`);
    }

    if (user.banned) {
      throw new ForbiddenError('Your account has been banned by the administrator.');
    }

    if (!user.isVerified && user.email && process.env.SKIP_EMAIL_VERIFICATION !== 'true') {
      throw new ForbiddenError('Please verify your email before logging in. Check your inbox for the verification link.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await handleFailedLogin(user);
      throw new UnauthorizedError('Unauthorized');
    }

    await resetLoginAttempts(user);
    logger.info(`User logged in successfully: ${user.username}`);

    const accessToken = this.generateToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    await user.update({ refreshToken: this.hashToken(refreshToken) });

    return {
      user: {
        id: user.id,
        role: user.role as AuthenticatedUser['role'],
        username: user.username,
        full_name: user.full_name,
        email: user.email,
      },
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    };
  }

  static async refreshToken(incomingToken: string): Promise<RefreshResult> {
    if (!incomingToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    try {
      const decoded = jwt.verify(
        incomingToken,
        process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET as string)
      ) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user || user.refreshToken !== this.hashToken(incomingToken)) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      if (user.banned) {
        throw new ForbiddenError('Account banned');
      }

      const accessToken = this.generateToken(user.id, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      await user.update({ refreshToken: this.hashToken(refreshToken) });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('There is no user with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ resetPasswordToken, resetPasswordExpire });

    try {
      const template = emailTemplates.passwordReset(user.full_name, resetToken);
      await sendEmail({
        email: user.email!,
        subject: template.subject,
        message: `You are receiving this email because you requested a password reset. Visit: ${process.env.FRONTEND_URL}/resetpassword/${resetToken}`,
        html: template.html,
      });
      logger.info(`Password reset email sent to: ${user.email}`);
    } catch (err: unknown) {
      logger.error({ email: user.email, err }, `Error sending email to ${user.email}`);
      await user.update({ resetPasswordToken: null, resetPasswordExpire: null });
      throw new Error('Email could not be sent');
    }
  }

  static async resetPassword(resettoken: string, password: string): Promise<ResetPasswordResult> {
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
      refreshToken: this.hashToken(refreshToken),
    });

    logger.info(`User reset password successfully: ${user.username}`);

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }
}
