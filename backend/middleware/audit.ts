import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/db';
import { logger } from '../utils/logger';

// ─── Audit Actions ───────────────────────────────────────────────────────────

export const AUDIT_ACTIONS: Record<string, string> = {
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
  CORS_VIOLATION: 'CORS_VIOLATION',
};

// ─── Audit Table Init ────────────────────────────────────────────────────────

const initAuditTable = async (): Promise<void> => {
  try {
    const [results] = await sequelize.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'AuditLogs')`
    );
    const exists = (results as Record<string, unknown>[])[0]?.exists as boolean;
    if (!exists) {
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
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err.message }, 'Audit table creation failed, using in-memory fallback');
  }
};

// ─── In-Memory Fallback ──────────────────────────────────────────────────────

interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId: number | null;
  userRole: string | null;
  ip: string | null;
  targetId: number | null;
  targetType: string | null;
  metadata: Record<string, unknown>;
  success: boolean;
}

const auditLogsMemory: AuditLogEntry[] = [];

// ─── Audit Log ───────────────────────────────────────────────────────────────

interface AuditLogDetails {
  userId?: number;
  userRole?: string;
  ip?: string;
  targetId?: number;
  targetType?: string;
  metadata?: Record<string, unknown>;
  success?: boolean;
}

export const logAudit = (action: string, details: AuditLogDetails = {}): AuditLogEntry => {
  const logEntry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: details.userId ?? null,
    userRole: details.userRole ?? null,
    ip: details.ip ?? null,
    targetId: details.targetId ?? null,
    targetType: details.targetType ?? null,
    metadata: details.metadata ?? {},
    success: details.success !== false,
  };

  logger.info(logEntry, `AUDIT: ${action}`);

  const dialect = sequelize.getDialect();
  const metadataJson = JSON.stringify(logEntry.metadata);

  if (dialect === 'sqlite') {
    sequelize
      .query(
        `INSERT INTO "AuditLogs" (action, "userId", "userRole", ip, "targetId", "targetType", metadata, success)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            action,
            logEntry.userId,
            logEntry.userRole,
            logEntry.ip,
            logEntry.targetId,
            logEntry.targetType,
            metadataJson,
            logEntry.success,
          ]
        }
      )
      .catch(() => {
        auditLogsMemory.push(logEntry);
        if (auditLogsMemory.length > 10000) auditLogsMemory.shift();
      });
  } else {
    sequelize
      .query(
        `INSERT INTO "AuditLogs" (action, "userId", "userRole", ip, "targetId", "targetType", metadata, success)
         VALUES (?, ?, ?, ?, ?, ?, ?::jsonb, ?)`,
        {
          replacements: [
            action,
            logEntry.userId,
            logEntry.userRole,
            logEntry.ip,
            logEntry.targetId,
            logEntry.targetType,
            metadataJson,
            logEntry.success,
          ]
        }
      )
      .catch(() => {
        auditLogsMemory.push(logEntry);
        if (auditLogsMemory.length > 10000) auditLogsMemory.shift();
      });
  }

  return logEntry;
};

// ─── Audit Middleware ─────────────────────────────────────────────────────────

export const auditMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  req.auditLog = (action: string, details: Record<string, unknown> = {}) => {
    return logAudit(action, {
      ...details,
      userId: req.user?.id,
      userRole: req.user?.role,
      ip: req.ip,
    } as AuditLogDetails);
  };
  next();
};

// ─── Get Audit Logs ──────────────────────────────────────────────────────────

interface AuditFilters {
  userId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const getAuditLogs = async (filters: AuditFilters = {}): Promise<AuditLogEntry[]> => {
  try {
    let query = 'SELECT * FROM "AuditLogs" WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.userId) {
      query += ` AND "userId" = $${paramIndex++}`;
      params.push(filters.userId);
    }
    if (filters.action) {
      query += ` AND action = $${paramIndex++}`;
      params.push(filters.action);
    }
    if (filters.startDate) {
      query += ` AND "createdAt" >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ` AND "createdAt" <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    query += ' ORDER BY "createdAt" DESC';
    if (filters.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(filters.limit);
    }

    const [results] = await sequelize.query(query, { replacements: params });
    return results as AuditLogEntry[];
  } catch {
    return auditLogsMemory;
  }
};

// Initialize audit table on module load
initAuditTable();
