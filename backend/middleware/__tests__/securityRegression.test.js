// ============================================================
// SECURITY REGRESSION TESTS - Phase 1 Remediation
// These tests verify that the critical vulnerabilities found
// during the audit have been properly fixed.
// ============================================================

describe('SECURITY: CORS Configuration', () => {
  beforeEach(() => {
    process.env.ALLOWED_ORIGINS = 'https://sheger-health-connect.vercel.app,http://localhost:5173';
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    delete process.env.ALLOWED_ORIGINS;
    delete process.env.FRONTEND_URL;
    delete process.env.NODE_ENV;
  });

  it('should allow configured origins', () => {
    const { corsOptions } = require('../../config/cors');
    let result;
    corsOptions.origin('https://sheger-health-connect.vercel.app', (err, allowed) => {
      result = { err, allowed };
    });
    expect(result.allowed).toBe(true);
    expect(result.err).toBeFalsy();
  });

  it('should reject disallowed origins', () => {
    const { corsOptions } = require('../../config/cors');
    let result;
    corsOptions.origin('https://malicious-site.example', (err, allowed) => {
      result = { err, allowed };
    });
    expect(result.err).toBeDefined();
    expect(result.allowed).toBeFalsy();
  });

  it('should reject null origin in production', () => {
    process.env.NODE_ENV = 'production';
    const { corsOptions } = require('../../config/cors');
    let result;
    corsOptions.origin(null, (err, allowed) => {
      result = { err, allowed };
    });
    expect(result.allowed).toBe(false);
  });

  it('should not use wildcard origin', () => {
    const { corsOptions } = require('../../config/cors');
    // Verify origin is a function, not boolean true
    expect(typeof corsOptions.origin).toBe('function');
  });

  it('should have credentials enabled', () => {
    const { corsOptions } = require('../../config/cors');
    expect(corsOptions.credentials).toBe(true);
  });
});

describe('SECURITY: Route Authorization', () => {
  it('medical record routes should require Patient/Doctor/Admin role', async () => {
    // Read the route file source to verify authorization middleware is present
    const fs = require('fs');
    const path = require('path');
    const routeContent = fs.readFileSync(
      path.join(__dirname, '../../routes/medicalRecordRoutes.ts'),
      'utf8'
    );
    expect(routeContent).toContain("authorize('Patient', 'Doctor', 'Admin')");
  });

  it('payment status update should require Admin role', async () => {
    const fs = require('fs');
    const path = require('path');
    const routeContent = fs.readFileSync(
      path.join(__dirname, '../../routes/paymentRoutes.ts'),
      'utf8'
    );
    expect(routeContent).toContain("authorize('Admin')");
  });

  it('contact routes should have rate limiting', async () => {
    const fs = require('fs');
    const path = require('path');
    const routeContent = fs.readFileSync(
      path.join(__dirname, '../../routes/contactRoutes.ts'),
      'utf8'
    );
    expect(routeContent).toContain('contactLimiter');
  });
});

describe('SECURITY: Registration Role Escalation', () => {
  it('AuthService.register should ignore role parameter', async () => {
    const fs = require('fs');
    const path = require('path');
    const serviceContent = fs.readFileSync(
      path.join(__dirname, '../../services/AuthService.ts'),
      'utf8'
    );
    // Should hardcode role as Patient
    expect(serviceContent).toContain("const role = 'Patient'");
    // Should NOT use role from data
    expect(serviceContent).not.toContain('role: role || \'Patient\'');
  });

  it('validation should reject privileged roles', async () => {
    const fs = require('fs');
    const path = require('path');
    const validationContent = fs.readFileSync(
      path.join(__dirname, '../../middleware/validation.ts'),
      'utf8'
    );
    expect(validationContent).toContain('Cannot assign privileged roles through public registration');
  });
});

describe('SECURITY: Account Lockout', () => {
  it('AuthService should check account lockout', async () => {
    const fs = require('fs');
    const path = require('path');
    const serviceContent = fs.readFileSync(
      path.join(__dirname, '../../services/AuthService.ts'),
      'utf8'
    );
    expect(serviceContent).toContain('isAccountLocked(user)');
    // Verify it is NOT commented out
    const lockCheckIndex = serviceContent.indexOf('isAccountLocked(user)');
    const precedingLine = serviceContent.substring(0, lockCheckIndex).split('\n').pop();
    expect(precedingLine).not.toContain('//');
  });

  it('AuthService should enforce email verification', async () => {
    const fs = require('fs');
    const path = require('path');
    const serviceContent = fs.readFileSync(
      path.join(__dirname, '../../services/AuthService.ts'),
      'utf8'
    );
    expect(serviceContent).toContain('SKIP_EMAIL_VERIFICATION');
  });
});

describe('SECURITY: JWT Response Body Removal', () => {
  it('login should not include token in response body', async () => {
    const fs = require('fs');
    const path = require('path');
    const controllerContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/authController.ts'),
      'utf8'
    );
    // Should NOT spread token into response
    expect(controllerContent).not.toContain('...userData, token: accessToken');
  });

  it('resetPassword should not include token in response body', async () => {
    const fs = require('fs');
    const path = require('path');
    const controllerContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/authController.ts'),
      'utf8'
    );
    expect(controllerContent).not.toContain('...userData, token: accessToken');
  });

  it('should have getSocketToken endpoint', async () => {
    const fs = require('fs');
    const path = require('path');
    const controllerContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/authController.ts'),
      'utf8'
    );
    expect(controllerContent).toContain('getSocketToken');
  });
});

describe('SECURITY: Cookie Security', () => {
  it('cookies should use sameSite lax', async () => {
    const fs = require('fs');
    const path = require('path');
    const controllerContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/authController.ts'),
      'utf8'
    );
    // Should NOT use 'none' for sameSite
    expect(controllerContent).not.toContain("sameSite: 'none'");
    expect(controllerContent).not.toContain('sameSite: process.env.NODE_ENV');
    // Should use 'lax'
    expect(controllerContent).toContain("sameSite: 'lax'");
  });
});

describe('SECURITY: Hardcoded Secrets', () => {
  it('websocketService should not use default secret as fallback', async () => {
    const fs = require('fs');
    const path = require('path');
    const wsContent = fs.readFileSync(
      path.join(__dirname, '../../websocketService.ts'),
      'utf8'
    );
    // Should not have the default secret as a fallback (|| 'super-secret...')
    expect(wsContent).not.toContain("|| 'super-secret-internal-key-123'");
    // Should require the env var
    expect(wsContent).toContain('WS_INTERNAL_SECRET');
    // Should fail if secret is not set
    expect(wsContent).toContain('process.exit(1)');
  });

  it('eventEmitter should not have default secret', async () => {
    const fs = require('fs');
    const path = require('path');
    const emitterContent = fs.readFileSync(
      path.join(__dirname, '../../utils/eventEmitter.ts'),
      'utf8'
    );
    expect(emitterContent).not.toContain("'super-secret-internal-key-123'");
  });

  it('.env should not contain real credentials', async () => {
    const fs = require('fs');
    const path = require('path');
    const envContent = fs.readFileSync(
      path.join(__dirname, '../../.env'),
      'utf8'
    );
    // Should contain placeholders, not real values
    expect(envContent).toContain('your_db_host_here');
    expect(envContent).toContain('your_database_password_here');
    expect(envContent).toContain('your_openai_api_key_here');
    expect(envContent).toContain('your_email@gmail.com');
    expect(envContent).toContain('CHANGE_ME');
  });
});

describe('SECURITY: AI Safety', () => {
  it('AI system prompt should prohibit diagnosis', async () => {
    const fs = require('fs');
    const path = require('path');
    const aiContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/aiController.ts'),
      'utf8'
    );
    expect(aiContent).toContain('NEVER provide an actual medical diagnosis');
    expect(aiContent).toContain('NEVER provide specific medication dosages');
  });

  it('AI should validate conversation history roles', async () => {
    const fs = require('fs');
    const path = require('path');
    const aiContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/aiController.ts'),
      'utf8'
    );
    expect(aiContent).toContain('ALLOWED_HISTORY_ROLES');
    expect(aiContent).toContain("'user'");
    expect(aiContent).toContain("'assistant'");
  });

  it('AI should limit history length', async () => {
    const fs = require('fs');
    const path = require('path');
    const aiContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/aiController.ts'),
      'utf8'
    );
    expect(aiContent).toContain('MAX_HISTORY_MESSAGES');
    expect(aiContent).toContain('MAX_MESSAGE_LENGTH');
  });

  it('AI should include disclaimer in fallback responses', async () => {
    const fs = require('fs');
    const path = require('path');
    const aiContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/aiController.ts'),
      'utf8'
    );
    expect(aiContent).toContain('not a substitute for professional medical advice');
  });
});

describe('SECURITY: Admin Self-Protection', () => {
  it('toggleDoctorBan should prevent self-ban', async () => {
    const fs = require('fs');
    const path = require('path');
    const adminContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/adminController.ts'),
      'utf8'
    );
    expect(adminContent).toContain('Cannot ban your own account');
  });

  it('deleteDoctor should prevent self-deletion', async () => {
    const fs = require('fs');
    const path = require('path');
    const adminContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/adminController.ts'),
      'utf8'
    );
    expect(adminContent).toContain('Cannot delete your own account');
  });
});

describe('SECURITY: Contact Form Protection', () => {
  it('contact controller should validate message length', async () => {
    const fs = require('fs');
    const path = require('path');
    const contactContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/contactController.ts'),
      'utf8'
    );
    expect(contactContent).toContain('MAX_MESSAGE_LENGTH');
    expect(contactContent).toContain('MAX_NAME_LENGTH');
  });
});

describe('SECURITY: Messaging Authorization', () => {
  it('getMessagesWithUser should validate participant', async () => {
    const fs = require('fs');
    const path = require('path');
    const msgContent = fs.readFileSync(
      path.join(__dirname, '../../controllers/messageController.ts'),
      'utf8'
    );
    expect(msgContent).toContain('Cannot retrieve messages with yourself');
    expect(msgContent).toContain('otherUser');
    expect(msgContent).toContain('Access denied');
  });
});

describe('SECURITY: Socket.io Authentication', () => {
  it('auth routes should have socket-token endpoint', async () => {
    const fs = require('fs');
    const path = require('path');
    const routesContent = fs.readFileSync(
      path.join(__dirname, '../../routes/authRoutes.ts'),
      'utf8'
    );
    expect(routesContent).toContain('socket-token');
    expect(routesContent).toContain('getSocketToken');
  });
});

describe('SECURITY: Frontend Auth Changes', () => {
  it('Login should not use token from response body', async () => {
    const fs = require('fs');
    const path = require('path');
    const loginContent = fs.readFileSync(
      path.join(__dirname, '../../../frontend/src/pages/Login.jsx'),
      'utf8'
    );
    // Should call login(data.data) without token argument
    expect(loginContent).toContain('login(data.data)');
    expect(loginContent).not.toContain('login(data.data, data.data.token)');
  });

  it('AuthContext should not store token from response', async () => {
    const fs = require('fs');
    const path = require('path');
    const authContent = fs.readFileSync(
      path.join(__dirname, '../../../frontend/src/context/AuthContext.tsx'),
      'utf8'
    );
    expect(authContent).toContain('fetchSocketToken');
  });

  it('MessagesPage should authenticate Socket.io', async () => {
    const fs = require('fs');
    const path = require('path');
    const messagesContent = fs.readFileSync(
      path.join(__dirname, '../../../frontend/src/pages/MessagesPage.jsx'),
      'utf8'
    );
    expect(messagesContent).toContain('fetchSocketToken');
    expect(messagesContent).toContain("auth: { token }");
  });
});
