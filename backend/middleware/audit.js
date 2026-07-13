const { logger } = require('./logger');

// Audit log storage (in production, use database or external service)
const auditLogs = [];

// Audit action types
const AUDIT_ACTIONS = {
  // Auth events
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE: 'PASSWORD_RESET_COMPLETE',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Appointment events
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_STATUS_CHANGED: 'APPOINTMENT_STATUS_CHANGED',
  APPOINTMENT_TRANSFERRED: 'APPOINTMENT_TRANSFERRED',
  
  // Medical record events
  MEDICAL_RECORD_CREATED: 'MEDICAL_RECORD_CREATED',
  MEDICAL_RECORD_ACCESSED: 'MEDICAL_RECORD_ACCESSED',
  
  // Message events
  MESSAGE_SENT: 'MESSAGE_SENT',
  
  // Payment events
  PAYMENT_SUBMITTED: 'PAYMENT_SUBMITTED',
  PAYMENT_STATUS_CHANGED: 'PAYMENT_STATUS_CHANGED',
  
  // Admin events
  DOCTOR_ONBOARDED: 'DOCTOR_ONBOARDED',
  DOCTOR_BANNED: 'DOCTOR_BANNED',
  DOCTOR_UNBANNED: 'DOCTOR_UNBANNED',
  DOCTOR_DELETED: 'DOCTOR_DELETED',
  
  // Security events
  UNAUTHORIZED_ACCESS_ATTEMPT: 'UNAUTHORIZED_ACCESS_ATTEMPT',
  CORS_VIOLATION: 'CORS_VIOLATION'
};

// Log an audit event
const auditLog = (action, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: details.userId || null,
    userRole: details.userRole || null,
    ip: details.ip || null,
    targetId: details.targetId || null,
    targetType: details.targetType || null,
    metadata: details.metadata || {},
    success: details.success !== false
  };
  
  // Store in memory (replace with database in production)
  auditLogs.push(logEntry);
  
  // Keep only last 10000 logs in memory
  if (auditLogs.length > 10000) {
    auditLogs.shift();
  }
  
  // Also log via pino
  logger.info(logEntry, `AUDIT: ${action}`);
  
  return logEntry;
};

// Middleware to capture audit context
const auditMiddleware = (req, res, next) => {
  req.auditLog = (action, details = {}) => {
    return auditLog(action, {
      ...details,
      userId: req.user ? req.user.id : null,
      userRole: req.user ? req.user.role : null,
      ip: req.ip
    });
  };
  next();
};

// Get audit logs (admin only)
const getAuditLogs = (filters = {}) => {
  let filtered = [...auditLogs];
  
  if (filters.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId);
  }
  if (filters.action) {
    filtered = filtered.filter(log => log.action === filters.action);
  }
  if (filters.startDate) {
    filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
  }
  
  return filtered;
};

module.exports = { 
  auditLog, 
  auditMiddleware, 
  getAuditLogs, 
  AUDIT_ACTIONS 
};
