# 🛡️ Sheger Health Connect - Security Architecture & Policies

This document outlines the comprehensive security measures, architectural boundaries, and best practices implemented across the Sheger Health Connect platform.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / BROWSER                                │
│        (Secure HTTPS Transit / Vercel SSL / CORS Policy Enforced)         │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │  Bearer JWT (24h Expiry)
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS REST API SERVER                           │
│                                                                           │
│   ┌────────────────────────┐             ┌────────────────────────────┐   │
│   │   protect Middleware   │────Valid───►│    authorize Middleware    │   │
│   │  (Verifies JWT Secret) │             │ (Enforces RBAC Boundaries) │   │
│   └───────────┬────────────┘             └─────────────┬──────────────┘   │
│               │ Invalid                                │ Authorized       │
│               ▼                                        ▼                  │
│       [ 401 Unauthorized ]                    [ Controller Logic ]        │
└────────────────────────────────────────────────────────┬──────────────────┘
                                                         │ Parameterized SQL
                                                         ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          SEQUELIZE ORM & MYSQL                            │
│           (Strict Data Typing / No Raw SQL / bcrypt Hashing)              │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Authentication & Authorization (RBAC)

### JSON Web Tokens (JWT)
Sheger Health Connect utilizes stateless, cryptographically signed JSON Web Tokens for user authentication. 
- Tokens are generated upon successful login using `process.env.JWT_SECRET`.
- Each token encapsulates the user's `id` and `role` (`Admin`, `Doctor`, `Patient`).
- Tokens are configured with a strict **24-hour expiration** window to minimize the impact of token interception.

### Route Protection Middleware (`protect`)
Every protected REST API endpoint passes through the `protect` asynchronous middleware:
1. Extracts the token from the `Authorization: Bearer <token>` header.
2. Cryptographically verifies the signature against the server's secret key.
3. Retrieves the authenticated user from the database while explicitly stripping out sensitive credentials (`password_hash`).
4. Rejects unauthorized requests immediately with a `401 Unauthorized` status code.

### Role-Based Access Control (`authorize`)
Granular route access is enforced via the `authorize(...roles)` middleware, establishing strict boundaries across the three user tiers:
- **Admin Tier:** Complete access to system logs, doctor onboarding, global patient management, and platform analytics.
- **Doctor Tier:** Access restricted to assigned appointments, patient medical histories, clinical messaging, and staff group chats.
- **Patient Tier:** Access restricted to personal appointment booking, AI triage consultation, and direct messaging with assigned physicians.
- *Enforcement:* Attempts to access higher-tier endpoints result in an immediate `403 Forbidden` response.

---

## 2. Data Protection & Cryptography

### Password Storage
- **Algorithm:** Passwords are hashed using `bcryptjs` with an industry-standard salt work factor.
- **Zero Plaintext Policy:** Plaintext passwords are never stored in the database, logged to standard output, or exposed in debugging traces.
- **Verification:** Authentication relies entirely on constant-time hash comparison (`bcrypt.compare`), mitigating timing attacks.

### Payload Sanitization
To prevent data leakage, all API responses returning user profiles or lists automatically sanitize the payload. Attributes such as `password_hash`, `resetPasswordToken`, and `resetPasswordExpire` are explicitly excluded at the ORM query level (`attributes: { exclude: [...] }`).

### Transport Security
All client-server communications operate exclusively over HTTPS. Vercel (Frontend) and Render (Backend) provide automated SSL/TLS termination, ensuring all data in transit—including JWTs, patient medical records, and private chat messages—is fully encrypted.

---

## 3. Database Security & Injection Prevention

### ORM-Level Protection
All database operations are managed through the Sequelize Object-Relational Mapper (ORM). 
- **Parameterized Queries:** Sequelize automatically uses parameterized queries and prepared statements for all `findAll`, `findOne`, `create`, `update`, and `destroy` operations.
- **No Raw SQL:** The application avoids raw SQL queries (`sequelize.query`), completely neutralizing SQL injection (SQLi) vulnerabilities.

### Strict Schema Constraints
The MySQL database tables enforce rigorous validation rules at the engine level:
- Strict `VARCHAR` length boundaries (e.g., `username: STRING(50)`).
- `allowNull: false` constraints on critical fields to maintain data integrity.
- `unique: true` indices on `username` and `email` to prevent account duplication and race conditions.

---

## 4. Network & API Security

### Cross-Origin Resource Sharing (CORS)
The Express server enforces a strict CORS policy, permitting HTTP requests only from explicitly authorized origins:
- `https://sheger-health-connect.vercel.app` (Live Production Frontend)
- `http://localhost:5173` / `http://localhost:3000` (Local Development Environments)
- *Protection:* Prevents malicious websites from executing unauthorized cross-site requests (CSRF/XSS) against the backend API.

### Rate Limiting & Error Sanitization
- **Error Handling:** Custom Express error middleware intercepts all asynchronous exceptions. In production mode, stack traces are suppressed, returning clean, generic error messages to prevent internal system layout leakage.

### WebSocket Isolation (Socket.io)
Real-time bi-directional messaging is isolated using Socket.io rooms:
- Users are assigned to private rooms corresponding to their unique user ID (`user_${id}`) and appointment IDs (`appointment_${id}`).
- Socket event listeners validate user identity before broadcasting messages, preventing cross-tenant chat leakage.

---

## 5. Account Lifecycle & Onboarding Security

### Admin-Controlled Onboarding
To maintain a high-trust clinical environment, public self-registration for Doctors and Administrators is **disabled**.
- New medical professionals can only be provisioned by an existing, fully authenticated Administrator via the protected `/api/admins/doctors` endpoint.
- This prevents fraudulent practitioner accounts from entering the specialist directory.

### Secure Account Recovery
- **Time-Bound Tokens:** Password reset requests generate a secure, randomized token (`resetPasswordToken`) valid for a strictly limited duration (`resetPasswordExpire`).
- **Validation:** Reset endpoints verify both token authenticity and expiration before allowing password mutation.

### Graceful Session Termination
Client-side logout routines immediately purge the JWT from local storage. To protect against accidental session termination or tampering, the frontend incorporates a secure confirmation modal prior to executing the logout sequence.

---
*Sheger Health Connect · Enterprise Security Architecture*
