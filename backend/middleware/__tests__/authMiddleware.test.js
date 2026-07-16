import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret-for-testing-only';
process.env.JWT_SECRET = JWT_SECRET;

// Mock accountSecurity
vi.mock('../../middleware/accountSecurity', () => ({
  isTokenBlacklisted: vi.fn().mockResolvedValue(false),
  blacklistToken: vi.fn().mockResolvedValue(true)
}));

// Mock the db config to prevent real database connection
vi.mock('../../config/db', () => ({
  sequelize: {
    define: vi.fn().mockReturnValue({}),
    authenticate: vi.fn(),
    close: vi.fn()
  }
}));

// Use vi.hoisted so mock variables are available before vi.mock runs
const { mockFindById } = vi.hoisted(() => {
  return {
    mockFindById: vi.fn()
  };
});

// Mock User model — since we also mock db, this factory will be used
vi.mock('../../models/User', () => {
  return { default: { findById: mockFindById }, __esModule: true };
});

// Import the middleware under test
const { protect, authorize } = await import('../authMiddleware.js');

describe('Auth Middleware', () => {
  let req, res, nextCalled;

  const createRes = () => {
    let status, data;
    return {
      get _status() { return status; },
      get _data() { return data; },
      status: (code) => ({ json: (d) => { status = code; data = d; } })
    };
  };

  beforeEach(() => {
    req = { headers: {}, user: null, cookies: {} };
    res = createRes();
    nextCalled = false;
    vi.clearAllMocks();
    // Default: findById returns a valid user
    mockFindById.mockResolvedValue({ id: 1, role: 'Patient', banned: false });
  });

  const next = () => { nextCalled = true; };

  describe('protect', () => {
    it('should return 401 if no token provided', async () => {
      await protect(req, res, next);
      expect(res._status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      req.cookies.accessToken = 'invalid-token';
      await protect(req, res, next);
      expect(res._status).toBe(401);
    });

    it('should return 401 if user not found', async () => {
      mockFindById.mockResolvedValue(null);
      const token = jwt.sign({ id: 999 }, JWT_SECRET);
      req.cookies.accessToken = token;
      await protect(req, res, next);
      expect(res._status).toBe(401);
    });

    it('should call next with user if token is valid', async () => {
      mockFindById.mockResolvedValue({ id: 1, role: 'Patient', banned: false });
      const token = jwt.sign({ id: 1 }, JWT_SECRET);
      req.cookies.accessToken = token;
      await protect(req, res, next);
      expect(nextCalled).toBe(true);
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(1);
    });
  });

  describe('authorize', () => {
    it('should return middleware function', () => {
      const middleware = authorize('Admin');
      expect(typeof middleware).toBe('function');
    });

    it('should return 403 if user role not authorized', () => {
      const middleware = authorize('Admin');
      req.user = { role: 'Patient' };
      middleware(req, res, next);
      expect(res._status).toBe(403);
    });

    it('should call next if user role is authorized', () => {
      const middleware = authorize('Admin');
      req.user = { role: 'Admin' };
      middleware(req, res, next);
      expect(nextCalled).toBe(true);
    });

    it('should accept multiple roles', () => {
      const middleware = authorize('Admin', 'Doctor');
      req.user = { role: 'Doctor' };
      middleware(req, res, next);
      expect(nextCalled).toBe(true);
    });

    it('should reject unauthorized role with multiple allowed', () => {
      const middleware = authorize('Admin', 'Doctor');
      req.user = { role: 'Patient' };
      middleware(req, res, next);
      expect(res._status).toBe(403);
    });

    it('should return 401 if no user', () => {
      const middleware = authorize('Admin');
      middleware(req, res, next);
      expect(res._status).toBe(401);
    });
  });
});
