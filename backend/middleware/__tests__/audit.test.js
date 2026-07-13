const {
  AUDIT_ACTIONS,
  auditMiddleware,
  auditLog,
  getAuditLogs
} = require('../audit');

describe('Audit Middleware', () => {
  describe('AUDIT_ACTIONS', () => {
    it('should contain all required audit actions', () => {
      expect(AUDIT_ACTIONS.USER_LOGIN).toBeDefined();
      expect(AUDIT_ACTIONS.USER_LOGOUT).toBeDefined();
      expect(AUDIT_ACTIONS.PASSWORD_RESET_REQUEST).toBeDefined();
      expect(AUDIT_ACTIONS.PASSWORD_RESET_COMPLETE).toBeDefined();
      expect(AUDIT_ACTIONS.APPOINTMENT_CREATED).toBeDefined();
      expect(AUDIT_ACTIONS.APPOINTMENT_STATUS_CHANGED).toBeDefined();
      expect(AUDIT_ACTIONS.MEDICAL_RECORD_CREATED).toBeDefined();
      expect(AUDIT_ACTIONS.MESSAGE_SENT).toBeDefined();
      expect(AUDIT_ACTIONS.PAYMENT_SUBMITTED).toBeDefined();
      expect(AUDIT_ACTIONS.DOCTOR_ONBOARDED).toBeDefined();
      expect(AUDIT_ACTIONS.DOCTOR_BANNED).toBeDefined();
      expect(AUDIT_ACTIONS.DOCTOR_UNBANNED).toBeDefined();
      expect(AUDIT_ACTIONS.DOCTOR_DELETED).toBeDefined();
    });
  });

  describe('auditMiddleware', () => {
    it('should add auditLog function to request', () => {
      const req = {};
      const res = {};
      const next = () => {};

      auditMiddleware(req, res, next);

      expect(req.auditLog).toBeDefined();
      expect(typeof req.auditLog).toBe('function');
    });
  });

  describe('auditLog', () => {
    it('should log audit action with metadata', () => {
      const action = AUDIT_ACTIONS.USER_LOGIN;
      const metadata = { userId: 1, ip: '127.0.0.1' };

      const entry = auditLog(action, metadata);
      expect(entry).toBeDefined();
      expect(entry.action).toBe(action);
      expect(entry.userId).toBe(1);
    });

    it('should handle missing metadata', () => {
      const action = AUDIT_ACTIONS.USER_LOGIN;
      const entry = auditLog(action);
      expect(entry).toBeDefined();
      expect(entry.action).toBe(action);
    });
  });

  describe('getAuditLogs', () => {
    it('should return audit logs', () => {
      const logs = getAuditLogs();
      expect(Array.isArray(logs)).toBe(true);
    });

    it('should filter by action', () => {
      const logs = getAuditLogs({ action: 'USER_LOGIN' });
      expect(Array.isArray(logs)).toBe(true);
    });
  });
});
