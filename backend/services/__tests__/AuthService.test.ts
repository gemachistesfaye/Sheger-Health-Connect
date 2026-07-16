import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';

const { mockFindOne, mockFindById, mockCreate, mockSendEmail, mockIsAccountLocked, mockHandleFailedLogin, mockResetLoginAttempts, mockLogger } = vi.hoisted(() => ({
  mockFindOne: vi.fn(),
  mockFindById: vi.fn(),
  mockCreate: vi.fn(),
  mockSendEmail: vi.fn(),
  mockIsAccountLocked: vi.fn(() => false),
  mockHandleFailedLogin: vi.fn(),
  mockResetLoginAttempts: vi.fn(),
  mockLogger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../models/User', () => ({
  default: { findOne: mockFindOne, findById: mockFindById, create: mockCreate }
}));

vi.mock('../../utils/emailService', () => ({
  default: mockSendEmail
}));

vi.mock('../../utils/emailTemplates', () => ({
  default: {
    verification: vi.fn(() => ({ subject: 'Verify', html: '<p>Verify</p>' })),
    welcomeVerified: vi.fn(() => ({ subject: 'Welcome', html: '<p>Welcome</p>' })),
    passwordReset: vi.fn(() => ({ subject: 'Reset', html: '<p>Reset</p>' })),
  }
}));

vi.mock('../../middleware/accountSecurity', () => ({
  isAccountLocked: mockIsAccountLocked,
  handleFailedLogin: mockHandleFailedLogin,
  resetLoginAttempts: mockResetLoginAttempts,
}));

vi.mock('../../utils/logger', () => ({
  logger: mockLogger
}));

import { AuthService } from '../AuthService';

describe('AuthService', () => {
  beforeEach(() => {
    mockFindOne.mockReset();
    mockFindById.mockReset();
    mockCreate.mockReset();
    mockSendEmail.mockReset();
    mockIsAccountLocked.mockReset();
    mockIsAccountLocked.mockReturnValue(false);
    mockHandleFailedLogin.mockReset();
    mockResetLoginAttempts.mockReset();
    mockLogger.info.mockReset();
    mockLogger.error.mockReset();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = AuthService.generateToken(1, 'Patient');
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = AuthService.generateRefreshToken(1);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('hashToken', () => {
    it('should return SHA-256 hash of token', () => {
      const token = 'test-token-123';
      const expected = crypto.createHash('sha256').update(token).digest('hex');
      const result = (AuthService as any).hashToken(token);
      expect(result).toBe(expected);
    });
  });

  describe('register', () => {
    it('should throw error if required fields missing', async () => {
      await expect(AuthService.register({})).rejects.toThrow('Please provide required fields');
    });

    it('should throw error if username already exists', async () => {
      mockFindOne.mockResolvedValueOnce({ id: 1 });
      await expect(AuthService.register({ full_name: 'Test', username: 'test', password: 'pass123' })).rejects.toThrow('Username is already taken');
    });

    it('should create user successfully', async () => {
      mockFindOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({ id: 1, username: 'test', full_name: 'Test' });

      const result = await AuthService.register({
        full_name: 'Test User',
        username: 'test',
        password: 'password123'
      });

      expect(result.message).toContain('Registration successful');
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw error if username/password missing', async () => {
      await expect(AuthService.login({})).rejects.toThrow('Please provide username and password');
    });

    it('should throw error if user not found', async () => {
      mockFindOne.mockResolvedValueOnce(null);
      await expect(AuthService.login({ username: 'test', password: 'pass' })).rejects.toThrow('Invalid username or password');
    });

    it('should throw error if account is locked', async () => {
      mockIsAccountLocked.mockReturnValueOnce(true);
      mockFindOne.mockResolvedValueOnce({
        lockUntil: new Date(Date.now() + 60000),
        banned: false,
        isVerified: true,
        email: 'test@test.com'
      });
      await expect(AuthService.login({ username: 'test', password: 'pass' })).rejects.toThrow('Account is locked');
    });

    it('should throw error if account is banned', async () => {
      mockIsAccountLocked.mockReturnValueOnce(false);
      mockFindOne.mockResolvedValueOnce({
        banned: true,
        isVerified: true,
        email: 'test@test.com'
      });
      await expect(AuthService.login({ username: 'test', password: 'pass' })).rejects.toThrow('banned');
    });
  });

  describe('forgotPassword', () => {
    it('should throw error if user not found', async () => {
      mockFindOne.mockResolvedValueOnce(null);
      await expect(AuthService.forgotPassword('nonexistent@email.com')).rejects.toThrow('There is no user with that email');
    });

    it('should send reset email for existing user', async () => {
      const mockUpdate = vi.fn().mockResolvedValue(true);
      mockFindOne.mockResolvedValueOnce({
        id: 1,
        email: 'test@email.com',
        full_name: 'Test',
        update: mockUpdate
      });

      await AuthService.forgotPassword('test@email.com');
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
