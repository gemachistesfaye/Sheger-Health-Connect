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

export interface JwtRefreshPayload {
  id: number;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  auditLog?: (action: string, details?: Record<string, unknown>) => void;
  requestId?: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  requestId?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface CreateUserInput {
  full_name: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  role?: UserRole;
  specialization?: string;
}

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

export interface UpdateAppointmentStatusInput {
  status: AppointmentStatus;
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

export interface UpdatePaymentStatusInput {
  status: PaymentStatus;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface SendMessageInput {
  receiver_id: number;
  message: string;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AiChatInput {
  message: string;
  language?: string;
  history?: AiChatMessage[];
}

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface OnboardDoctorInput {
  full_name: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  specialization?: string;
  department?: string;
}

export interface ToggleBanInput {
  banned: boolean;
}

export interface TransferAppointmentInput {
  doctor_id: number;
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

// ─── Socket ──────────────────────────────────────────────────────────────────

export interface SocketPayload {
  room: string;
  event: string;
  data: unknown;
}

export interface SocketNotificationPayload {
  title: string;
  body: string;
  url?: string;
  timestamp?: string;
}

// ─── Audit ───────────────────────────────────────────────────────────────────

export interface AuditLogParams {
  userId?: number;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
