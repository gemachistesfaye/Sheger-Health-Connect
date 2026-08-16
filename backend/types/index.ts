import { Request } from 'express';

// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'Doctor' | 'Patient';

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
  username: string;
  full_name: string;
  email: string | null;
}

export interface JwtPayload {
  id: number;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  auditLog?: (action: string, details?: Record<string, unknown>) => void;
  requestId?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  specialization?: string;
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface CreateAppointmentInput {
  doctor_id: number;
  department: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

// ─── Medical Record ──────────────────────────────────────────────────────────

export interface CreateMedicalRecordInput {
  patient_id: number;
  appointment_id?: number;
  diagnosis: string;
  prescriptions?: string;
  allergies?: string;
  lab_results?: string;
  notes?: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Completed';

export interface CreatePaymentInput {
  patient_name: string;
  amount: number;
  status?: PaymentStatus;
  screenshot?: string;
}

// ─── Email ───────────────────────────────────────────────────────────────────

export interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}
