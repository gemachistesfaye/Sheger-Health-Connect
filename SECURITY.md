# 🛡️ Security Policy & Vulnerability Disclosure

At **Sheger Health Connect**, we take the security and privacy of patient medical data, physician communications, and administrative operations incredibly seriously. This document outlines our security support policies, vulnerability reporting procedures, and architectural safeguards.

---

## 🔒 Supported Versions

We actively maintain and provide security patches for the latest major production releases.

| Version | Supported | Description |
| :---: | :---: | --- |
| **v1.0.x (Current)** | ✅ Yes | Production release with full RBAC, JWT auth, and private chat isolation. |
| **< v1.0.0** | ❌ No | Alpha/Beta pre-release builds. Please upgrade to the latest stable release. |

---

## 🚨 Reporting a Vulnerability

We deeply value the efforts of security researchers, developers, and clinical staff in keeping our platform secure. If you discover a potential security vulnerability in Sheger Health Connect, **please do not disclose it publicly in GitHub issues**.

### Reporting Process:

1. **Private Contact:** Email your findings directly to the lead maintainer at **[gemachistesfaye@gmail.com](mailto:gemachistesfaye@gmail.com)** or submit a private vulnerability report via the GitHub Security tab.
2. **Details to Include:**
   - Summary of the vulnerability (e.g., XSS, SQLi, Broken Access Control, IDOR).
   - Proof of Concept (PoC) or step-by-step instructions to reproduce the issue.
   - Perceived impact on patient data privacy or system integrity.
3. **Response Timeline:**
   - **Triage & Acknowledgment:** Within 24–48 hours of submission.
   - **Remediation & Patching:** Within 3–5 business days depending on severity.
   - **Coordinated Disclosure:** Once a fix is deployed to production, we will publish a security advisory crediting the discovering researcher.

---

## 🛡️ Core Security Safeguards

For an exhaustive breakdown of our backend middleware, database models, and network boundaries, please review our comprehensive [Security Architecture Documentation](docs/security.md).

### 1. Role-Based Access Control (RBAC)
Strict isolation between **Admin**, **Doctor**, and **Patient** roles is enforced at the Express middleware level (`authorize`). Lateral or vertical privilege escalation is systematically blocked across all REST API endpoints.

### 2. Private Conversation Routing
Direct messaging between doctors and patients uses strict sender/receiver ID validation at both the Express controller and Socket.io WebSocket levels, ensuring that medical consultations remain completely confidential with zero cross-tenant leakage.

### 3. Data Protection & Cryptography
- **Passwords:** Hashed securely using `bcrypt` with automated salt generation. Plaintext passwords are never stored in the database or logged in system outputs.
- **Tokens:** Stateless JSON Web Tokens (JWT) with strict 24-hour expiration windows.
- **SQL Injection:** Every database query executes through Sequelize ORM using parameterized statements, preventing raw SQL injection.
- **Transit:** 100% encrypted over HTTPS/TLS via Vercel and Render SSL termination.

---

<p align="center">
  🔒 <i>Protecting Healthcare Connectivity with Enterprise-Grade Security</i>
</p>
