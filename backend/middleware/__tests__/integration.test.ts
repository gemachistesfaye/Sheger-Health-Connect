import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../app';
import User from '../../models/User';

let adminToken: string;
let doctorToken: string;
let patientToken: string;
let testPatientId: number;

beforeAll(async () => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash('TestPassword@123', salt);

  const admin = await User.create({
    full_name: 'Test Admin',
    username: 'test_admin_integ',
    password_hash: hash,
    role: 'Admin',
    isVerified: true
  });

  const doctor = await User.create({
    full_name: 'Dr. Test',
    username: 'test_doctor_integ',
    password_hash: hash,
    role: 'Doctor',
    specialization: 'General',
    isVerified: true
  });

  const patient = await User.create({
    full_name: 'Test Patient',
    username: 'test_patient_integ',
    password_hash: hash,
    role: 'Patient',
    isVerified: true
  });

  testPatientId = patient.id;

  adminToken = jwt.sign({ id: admin.id, role: 'Admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  doctorToken = jwt.sign({ id: doctor.id, role: 'Doctor' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  patientToken = jwt.sign({ id: patient.id, role: 'Patient' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
});

afterAll(async () => {
  await User.destroy({ where: { username: ['test_admin_integ', 'test_doctor_integ', 'test_patient_integ'] } });
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 for missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent_user_xyz', password: 'WrongPass@123' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return user data with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `accessToken=${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('Admin Endpoints', () => {
  describe('GET /api/admin/stats', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app)
        .get('/api/admin/stats');
      expect(res.status).toBe(401);
    });

    it('should return 403 for non-admin role', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Cookie', `accessToken=${doctorToken}`);
      expect(res.status).toBe(403);
    });

    it('should return stats for admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Cookie', `accessToken=${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('doctors');
      expect(res.body.data).toHaveProperty('patients');
    });
  });

  describe('GET /api/admin/doctors', () => {
    it('should return paginated doctors list', async () => {
      const res = await request(app)
        .get('/api/admin/doctors')
        .set('Cookie', `accessToken=${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('pagination');
    });
  });
});

describe('Appointment Endpoints', () => {
  describe('GET /api/appointments', () => {
    it('should return appointments for authenticated user', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .set('Cookie', `accessToken=${patientToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/appointments', () => {
    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Cookie', `accessToken=${patientToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });
});

describe('Doctor Directory', () => {
  describe('GET /api/doctors', () => {
    it('should return public doctor list without auth', async () => {
      const res = await request(app)
        .get('/api/doctors');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should not expose doctor emails', async () => {
      const res = await request(app)
        .get('/api/doctors');
      if (res.body.data && res.body.data.length > 0) {
        res.body.data.forEach((doc: any) => {
          expect(doc).not.toHaveProperty('email');
          expect(doc).not.toHaveProperty('password_hash');
        });
      }
    });
  });
});

describe('Health Check', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
    });
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/api/nonexistent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
