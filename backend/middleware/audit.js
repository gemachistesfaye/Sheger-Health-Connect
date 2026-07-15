const { sequelize } = require('../config/db');
const { logger } = require('../utils/logger');

const AUDIT_ACTIONS = {
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE: 'PASSWORD_RESET_COMPLETE',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_STATUS_CHANGED: 'APPOINTMENT_STATUS_CHANGED',
  APPOINTMENT_TRANSFERRED: 'APPOINTMENT_TRANSFERRED',
  MEDICAL_RECORD_CREATED: 'MEDICAL_RECORD_CREATED',
  MEDICAL_RECORD_ACCESSED: 'MEDICAL_RECORD_ACCESSED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  PAYMENT_SUBMITTED: 'PAYMENT_SUBMITTED',
  PAYMENT_STATUS_CHANGED: 'PAYMENT_STATUS_CHANGED',
  DOCTOR_ONBOARDED: 'DOCTOR_ONBOARDED',
  DOCTOR_BANNED: 'DOCTOR_BANNED',
  DOCTOR_UNBANNED: 'DOCTOR_UNBANNED',
  DOCTOR_DELETED: 'DOCTOR_DELETED',
  UNAUTHORIZED_ACCESS_ATTEMPT: 'UNAUTHORIZED_ACCESS_ATTEMPT',
  CORS_VIOLATION: 'CORS_VIOLATION'
};

const initAuditTable = async () => {
  try {
    const [results] = await sequelize.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'AuditLogs')`
    );
    if (!results[0].exists) {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "AuditLogs" (
          id SERIAL PRIMARY KEY,
          action VARCHAR(100) NOT NULL,
          "userId" INTEGER,
          "userRole" VARCHAR(50),
          ip VARCHAR(45),
          "targetId" INTEGER,
          "targetType" VARCHAR(50),
          metadata JSONB DEFAULT '{}',
          success BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_audit_action ON "AuditLogs" (action)`);
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_audit_user ON "AuditLogs" ("userId")`);
      await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_audit_created ON "AuditLogs" ("createdAt")`);
      logger.info('Audit log table created');
    }
  } catch (error) {
    logger.error({ error: error.message }, 'Audit table creation failed, using in-memory fallback');
  }
};

const auditLogsMemory = [];

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

  logger.info(logEntry, `AUDIT: ${action}`);

  const dialect = sequelize.getDialect();
  const metadataJson = JSON.stringify(logEntry.metadata);

  if (dialect === 'sqlite') {
    sequelize.query(
      `INSERT INTO "AuditLogs" (action, "userId", "userRole", ip, "targetId", "targetType", metadata, success)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [action, logEntry.userId, logEntry.userRole, logEntry.ip, logEntry.targetId, logEntry.targetType, metadataJson, logEntry.success]
    ).catch(() => {
      auditLogsMemory.push(logEntry);
      if (auditLogsMemory.length > 10000) auditLogsMemory.shift();
    });
  } else {
    sequelize.query(
      `INSERT INTO "AuditLogs" (action, "userId", "userRole", ip, "targetId", "targetType", metadata, success)
       VALUES (?, ?, ?, ?, ?, ?, ?::jsonb, ?)`,
      [action, logEntry.userId, logEntry.userRole, logEntry.ip, logEntry.targetId, logEntry.targetType, metadataJson, logEntry.success]
    ).catch(() => {
      auditLogsMemory.push(logEntry);
      if (auditLogsMemory.length > 10000) auditLogsMemory.shift();
    });
  }

  return logEntry;
};

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

const getAuditLogs = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM "AuditLogs" WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.userId) { query += ` AND "userId" = $${paramIndex++}`; params.push(filters.userId); }
    if (filters.action) { query += ` AND action = $${paramIndex++}`; params.push(filters.action); }
    if (filters.startDate) { query += ` AND "createdAt" >= $${paramIndex++}`; params.push(filters.startDate); }
    if (filters.endDate) { query += ` AND "createdAt" <= $${paramIndex++}`; params.push(filters.endDate); }

    query += ' ORDER BY "createdAt" DESC';
    if (filters.limit) { query += ` LIMIT $${paramIndex++}`; params.push(filters.limit); }

    const [results] = await sequelize.query(query, params);
    return results;
  } catch {
    return auditLogsMemory;
  }
};

initAuditTable();

module.exports = { auditLog, auditMiddleware, getAuditLogs, AUDIT_ACTIONS };
