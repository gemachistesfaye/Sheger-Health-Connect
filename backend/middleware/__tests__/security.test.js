const { requestId, securityHeaders, requestTimeout, corsPreflight, generateRequestId } = require('../security');

describe('Security Middleware', () => {
  let req, res, nextCalled;

  beforeEach(() => {
    req = {
      headers: {},
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      get: () => 'test-agent',
      setTimeout: vi.fn()
    };
    res = {
      setHeader: vi.fn(),
      status: vi.fn(() => ({ json: vi.fn() }))
    };
    nextCalled = false;
  });

  const next = () => { nextCalled = true; };

  describe('requestId', () => {
    it('should generate a request ID', () => {
      requestId(req, res, next);
      expect(req.requestId).toBeDefined();
      expect(typeof req.requestId).toBe('string');
      expect(req.requestId.length).toBe(32);
    });

    it('should use existing request ID from header', () => {
      req.headers['x-request-id'] = 'custom-id-123';
      requestId(req, res, next);
      expect(req.requestId).toBe('custom-id-123');
    });

    it('should set response header', () => {
      requestId(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
    });
  });

  describe('securityHeaders', () => {
    it('should set security headers', () => {
      securityHeaders(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
      expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin');
      expect(nextCalled).toBe(true);
    });
  });

  describe('requestTimeout', () => {
    it('should set timeout on request', () => {
      const middleware = requestTimeout(5000);
      middleware(req, res, next);
      expect(req.setTimeout).toHaveBeenCalled();
      expect(nextCalled).toBe(true);
    });

    it('should use default timeout', () => {
      const middleware = requestTimeout();
      middleware(req, res, next);
      expect(req.setTimeout).toHaveBeenCalledWith(30000, expect.any(Function));
    });
  });

  describe('corsPreflight', () => {
    it('should handle OPTIONS requests', () => {
      req.method = 'OPTIONS';
      corsPreflight(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Max-Age', '86400');
      expect(nextCalled).toBe(true);
    });

    it('should pass through non-OPTIONS requests', () => {
      req.method = 'GET';
      corsPreflight(req, res, next);
      expect(nextCalled).toBe(true);
    });
  });

  describe('generateRequestId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      expect(id1).not.toBe(id2);
    });

    it('should generate hex strings', () => {
      const id = generateRequestId();
      expect(/^[a-f0-9]+$/.test(id)).toBe(true);
    });
  });
});
