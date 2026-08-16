import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import { AUDIT_ACTIONS } from '../middleware/audit';
import sendEmail from '../utils/emailService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types';

const getDoctors = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const { count, rows: doctors } = await User.findAndCountAll({
      where: { role: 'Doctor' },
      attributes: { exclude: ['password_hash'] },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: doctors,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const onboardDoctor = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { full_name, username, email, phone, password, specialization, department } = req.body;

    if (!full_name || !username || !password) {
      res.status(400).json({ success: false, message: 'Missing required fields: full_name, username, password' });
      return;
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      res.status(400).json({ success: false, message: 'Username already exists' });
      return;
    }

    if (email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        res.status(400).json({ success: false, message: 'Email already registered' });
        return;
      }
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const doctor = await User.create({
      full_name,
      username,
      email,
      phone,
      password_hash,
      role: 'Doctor',
      specialization: specialization || 'General',
      department,
      isVerified: true,
      verificationToken: null,
      verificationExpire: null,
    });

    if (email) {
      try {
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        const htmlContent = `
          <!DOCTYPE html><html><head><meta charset="utf-8"><style>
          body{font-family:'Segoe UI',sans-serif;background:#f4f7fa;margin:0;padding:20px}
          .container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}
          .header{background:linear-gradient(135deg,#0077b6,#00b4d8);padding:30px;text-align:center}
          .header h1{color:#fff;margin:0;font-size:24px}
          .content{padding:30px;color:#333;line-height:1.6}
          .credentials{background:#e0f7fa;padding:15px;border-radius:8px;border-left:4px solid #0077b6;margin:15px 0}
          .btn{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0077b6,#00b4d8);color:#fff!important;text-decoration:none;border-radius:8px;font-weight:600;margin:20px 0}
          .footer{background:#f8f9fa;padding:20px;text-align:center;color:#666;font-size:12px}
          .warning{background:#fff3e0;padding:15px;border-radius:8px;border-left:4px solid #ff9800;margin:15px 0}
          </style></head><body><div class="container">
          <div class="header"><h1>Welcome to ShegerHealth</h1></div>
          <div class="content"><h2>Hello Dr. ${full_name},</h2>
          <p>An admin account has been created for you at <strong>ShegerHealth</strong>.</p>
          <p>You can now log in using the credentials below:</p>
          <div class="credentials"><strong>Login Credentials:</strong><br><strong>Username:</strong> ${username}<br><strong>Password:</strong> (sent separately by your administrator)</div>
          <div class="warning"><strong>Important:</strong> Your administrator will provide your initial password securely. Please change it after your first login.</div>
          <div style="text-align:center"><a href="${loginUrl}" class="btn">Login to Dashboard</a></div>
          <p><strong>Your Role:</strong> Doctor</p><p><strong>Specialization:</strong> ${specialization || 'General'}</p>
          </div><div class="footer"><p>&copy; ${new Date().getFullYear()} ShegerHealth. All rights reserved.</p></div>
          </div></body></html>`;

        await sendEmail({
          email,
          subject: 'Welcome to ShegerHealth - Your Doctor Account',
          message: `Hello Dr. ${full_name}, your account has been created.`,
          html: htmlContent,
        });
        logger.info({ doctor: full_name, email }, 'Welcome email sent');
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error({ email, error: error.message }, 'Error sending welcome email');
      }
    }

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.DOCTOR_ONBOARDED, {
        targetId: doctor.id,
        targetType: 'User',
        metadata: { username, specialization, email },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Doctor account created successfully' + (email ? '. Welcome email sent.' : ''),
      data: {
        id: doctor.id,
        full_name: doctor.full_name,
        username: doctor.username,
        email: doctor.email,
        specialization: doctor.specialization,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doctorCount = await User.count({ where: { role: 'Doctor' } });
    const patientCount = await User.count({ where: { role: 'Patient' } });
    const adminCount = await User.count({ where: { role: 'Admin' } });
    res.json({
      success: true,
      data: { doctors: doctorCount, patients: patientCount, admins: adminCount, totalUsers: doctorCount + patientCount + adminCount },
    });
  } catch (error) {
    next(error);
  }
};

const toggleDoctorBan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { banned } = req.body;
    const doctor = await User.findByPk(req.params.id as string);
    if (!doctor || doctor.role !== 'Doctor') {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }

    if (doctor.id === req.user.id) {
      res.status(400).json({ success: false, message: 'Cannot ban your own account' });
      return;
    }

    doctor.banned = banned;
    await doctor.save();
    if (req.auditLog) {
      req.auditLog(banned ? AUDIT_ACTIONS.DOCTOR_BANNED : AUDIT_ACTIONS.DOCTOR_UNBANNED, {
        targetId: doctor.id,
        targetType: 'User',
        metadata: { username: doctor.username },
      });
    }
    res.json({
      success: true,
      message: `Doctor account ${banned ? 'banned' : 'unbanned'} successfully`,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doctor = await User.findByPk(req.params.id as string);
    if (!doctor || doctor.role !== 'Doctor') {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }

    if (doctor.id === req.user.id) {
      res.status(400).json({ success: false, message: 'Cannot delete your own account' });
      return;
    }

    const doctorData = { username: doctor.username, full_name: doctor.full_name };
    await doctor.destroy();
    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.DOCTOR_DELETED, {
        targetId: parseInt(req.params.id as string),
        targetType: 'User',
        metadata: doctorData,
      });
    }
    res.json({ success: true, message: 'Doctor account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const transferAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { doctor_id } = req.body;
    const appointment = await Appointment.findByPk(req.params.id as string);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }

    const targetDoctor = await User.findOne({ where: { id: doctor_id, role: 'Doctor' } });
    if (!targetDoctor) {
      res.status(404).json({ success: false, message: 'Target doctor not found' });
      return;
    }

    appointment.doctor_id = doctor_id;
    appointment.department = targetDoctor.specialization || appointment.department;
    await appointment.save();

    res.json({
      success: true,
      message: `Appointment transferred to ${targetDoctor.full_name}`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, onboardDoctor, getStats, toggleDoctorBan, deleteDoctor, transferAppointment };
