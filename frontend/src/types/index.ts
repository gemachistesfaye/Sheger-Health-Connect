// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'Doctor' | 'Patient';

export interface User {
  id: number;
  full_name: string;
  username: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  specialization: string | null;
  isVerified: boolean;
  banned: boolean;
  created_at: string;
  updated_at: string;
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

// ─── Appointment ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  Doctor?: Pick<User, 'id' | 'full_name' | 'specialization'>;
  Patient?: Pick<User, 'id' | 'full_name' | 'phone' | 'email'>;
}

// ─── Medical Record ──────────────────────────────────────────────────────────

export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null;
  diagnosis: string;
  prescriptions: string | null;
  allergies: string | null;
  lab_results: string | null;
  notes: string | null;
  visit_date: string;
  updated_at: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Completed';

export interface Payment {
  id: number;
  patient_id: number | null;
  patient_name: string;
  amount: number;
  status: PaymentStatus;
  screenshot: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
  Sender?: Pick<User, 'id' | 'full_name'>;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
  isTranslationKey?: boolean;
  isError?: boolean;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface SystemLog {
  id: number;
  type: string;
  action: string;
  message: string;
  userId: number | null;
  userRole: string | null;
  ip: string | null;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface SystemMetrics {
  server: {
    status: string;
    uptime: number;
    pid: number;
    nodeVersion: string;
    environment: string;
  };
  database: {
    status: string;
    dialect: string;
    latency: string;
  };
  memory: {
    rss: string;
    heapUsed: string;
    heapTotal: string;
  };
  cpu: {
    user: number;
    system: number;
  };
  security: {
    rateLimiting: string;
    cors: string;
    helmet: string;
    jwt: string;
  };
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  url?: string;
  timestamp?: string;
}
