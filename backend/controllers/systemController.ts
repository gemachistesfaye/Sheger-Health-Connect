import { Request, Response } from 'express';
const { getAuditLogs, AUDIT_ACTIONS } = require('../middleware/audit');
const { logger } = require('../utils/logger');

const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
    const logs = await getAuditLogs({ limit });

    const formattedLogs = logs.map((log, idx) => {
      let type = 'INFO';
      if (log.action) {
        const action = log.action.toUpperCase();
        if (action.includes('LOGIN') || action.includes('REGISTER') || action.includes('CREATED') || action.includes('ONBOARDED') || action.includes('UNBANNED')) {
          type = 'SUCCESS';
        } else if (action.includes('LOCKED') || action.includes('BANNED') || action.includes('UNAUTHORIZED') || action.includes('VIOLATION') || action.includes('DELETED')) {
          type = 'ERROR';
        } else if (action.includes('CHANGED') || action.includes('TRANSFERRED') || action.includes('SUBMITTED')) {
          type = 'WARNING';
        }
      }

      return {
        id: log.id || idx + 1,
        type,
        action: log.action || 'UNKNOWN',
        message: formatLogMessage(log),
        userId: log.userId,
        userRole: log.userRole,
        ip: log.ip,
        timestamp: log.createdAt || log.timestamp,
        metadata: log.metadata || {}
      };
    });

    res.json({ success: true, data: formattedLogs });
  } catch (error) {
    logger.error(error, 'Get System Logs Error');
    res.status(500).json({ success: false, message: 'Server error fetching system logs' });
  }
};

const formatLogMessage = (log) => {
  const meta = log.metadata || {};
  switch (log.action) {
    case AUDIT_ACTIONS.USER_LOGIN:
      return `User logged in: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.USER_REGISTER:
      return `New user registered: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.USER_LOGOUT:
      return `User logged out: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.PASSWORD_RESET_REQUEST:
      return `Password reset requested for: ${meta.email || 'unknown'}`;
    case AUDIT_ACTIONS.PASSWORD_RESET_COMPLETE:
      return `Password reset completed for: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.ACCOUNT_LOCKED:
      return `Account locked after too many attempts: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.APPOINTMENT_CREATED:
      return `New appointment booked`;
    case AUDIT_ACTIONS.APPOINTMENT_STATUS_CHANGED:
      return `Appointment status changed to: ${meta.status || 'unknown'}`;
    case AUDIT_ACTIONS.APPOINTMENT_TRANSFERRED:
      return `Appointment transferred to doctor #${meta.targetDoctorId || 'unknown'}`;
    case AUDIT_ACTIONS.MEDICAL_RECORD_CREATED:
      return `Medical record created for patient #${meta.patientId || 'unknown'}`;
    case AUDIT_ACTIONS.MEDICAL_RECORD_ACCESSED:
      return `Medical record accessed`;
    case AUDIT_ACTIONS.MESSAGE_SENT:
      return `Message sent from user #${log.userId || 'unknown'}`;
    case AUDIT_ACTIONS.PAYMENT_SUBMITTED:
      return `Payment submitted: ${meta.amount || 'unknown'} ETB`;
    case AUDIT_ACTIONS.PAYMENT_STATUS_CHANGED:
      return `Payment status changed to: ${meta.status || 'unknown'}`;
    case AUDIT_ACTIONS.DOCTOR_ONBOARDED:
      return `Doctor onboarded: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.DOCTOR_BANNED:
      return `Doctor account banned: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.DOCTOR_UNBANNED:
      return `Doctor account unbanned: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.DOCTOR_DELETED:
      return `Doctor account deleted: ${meta.username || 'unknown'}`;
    case AUDIT_ACTIONS.UNAUTHORIZED_ACCESS_ATTEMPT:
      return `Unauthorized access attempt from IP: ${log.ip || 'unknown'}`;
    default:
      return `${log.action} event recorded`;
  }
};

const getSystemMetrics = async (req: Request, res: Response) => {
  try {
    const { sequelize } = require('../config/db');

    let dbStatus = 'connected';
    let dbLatency = 0;
    try {
      const start = Date.now();
      await sequelize.authenticate();
      dbLatency = Date.now() - start;
    } catch {
      dbStatus = 'disconnected';
    }

    const memUsage = process.memoryUsage();
    const metrics = {
      server: {
        status: 'operational',
        uptime: Math.floor(process.uptime()),
        pid: process.pid,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        status: dbStatus,
        dialect: sequelize.getDialect(),
        latency: `${dbLatency}ms`
      },
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
      },
      cpu: process.cpuUsage(),
      security: {
        rateLimiting: 'active',
        cors: 'enabled',
        helmet: 'active',
        jwt: 'enabled'
      }
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error(error, 'Get System Metrics Error');
    res.status(500).json({ success: false, message: 'Server error fetching metrics' });
  }
};

module.exports = { getSystemLogs, getSystemMetrics };
