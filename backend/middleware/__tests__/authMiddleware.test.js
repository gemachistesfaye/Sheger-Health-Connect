const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-testing-only';

const mockUser = { id: 1, role: 'Patient' };
let mockFindByPk = () => Promise.resolve(mockUser);

vi.mock('../../models/User', () => ({
  findByPk: (...args) => mockFindByPk(...args)
}));

const { protect, authorize } = require('../authMiddleware');

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
    req = { headers: {}, user: null };
    res = createRes();
    nextCalled = false;
    mockFindByPk = () => Promise.resolve(mockUser);
  });

  const next = () => { nextCalled = true; };

  describe('protect', () => {
    it('should return 401 if no token provided', async () => {
      await protect(req, res, next);
      expect(res._status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      await protect(req, res, next);
      expect(res._status).toBe(401);
    });

    it('should return 401 if user not found', async () => {
      mockFindByPk = () => Promise.resolve(null);
      const token = jwt.sign({ id: 999 }, JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;
      await protect(req, res, next);
      expect(res._status).toBe(401);
    });

    it('should call next with user if token is valid', async () => {
      mockFindByPk = () => Promise.resolve({ id: 1, role: 'Patient' });
      const token = jwt.sign({ id: 1 }, JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;
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
  });
});
