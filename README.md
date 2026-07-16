# 🏥 ShegerHealth

<p align="center">
  <a href="https://sheger-health-connect.vercel.app" target="_blank">
    <img src="docs/images/banner.png" width="100%" height="360" style="object-fit:cover; border-radius:16px;" alt="ShegerHealth Banner" />
  </a>
</p>

<p align="center">
  <a href="https://sheger-health-connect.vercel.app"><img src="https://img.shields.io/badge/Live%20App-Vercel-00C7B7?style=for-the-badge&logo=vercel" /></a>
  <a href="https://sheger-health-connect.onrender.com"><img src="https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render" /></a>
  <img src="https://img.shields.io/badge/Stack-React%20%2B%20Node.js-emerald?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge" />
</p>

---

## 🌐 Live Deployments
| Service | URL |
|---|---|
| 🌍 **Frontend App** | [sheger-health-connect.vercel.app](https://sheger-health-connect.vercel.app) |
| ⚙️ **Backend REST API** | [sheger-health-connect.onrender.com](https://sheger-health-connect.onrender.com) |

---

## 📸 Platform Screenshots

| 🏠 Landing Page | 🔐 Login Gateway | 📝 Registration |
| :---: | :---: | :---: |
| <img src="docs/images/img2_landing.png" width="100%" alt="Landing Page" /> | <img src="docs/images/img1_login.png" width="100%" alt="Login Page" /> | <img src="docs/images/img3_register.png" width="100%" alt="Register Page" /> |
| **🩺 Doctor Dashboard** | **📅 Doctor Appointments** | **💬 Doctor Messages** |
| <img src="docs/images/img4_doctor_dashboard.png" width="100%" alt="Doctor Dashboard" /> | <img src="docs/images/img5_doctor_schedule.png" width="100%" alt="Doctor Appointments" /> | <img src="docs/images/img6_doctor_chat.png" width="100%" alt="Doctor Chat" /> |
| **🔑 Admin Dashboard** | **👨‍⚕️ Admin Doctor Manager** | **👤 Patient Experience** |
| <img src="docs/images/img7_admin_dashboard.png" width="100%" alt="Admin Dashboard" /> | <img src="docs/images/img8_admin_doctors.png" width="100%" alt="Admin Doctors" /> | <img src="docs/images/img9_patient_dashboard.png" width="100%" alt="Patient Dashboard" /> |

---

# 🏥 ShegerHealth

## 🚀 Key Features

### 👤 Three Role-Based Portals

| Role | Access & Capabilities |
|---|---|
| 🔑 **Admin** | Manage all Doctors & Patients, view system logs, track payments, send messages to any user |
| 🩺 **Doctor** | Manage appointments, view patient histories, isolated direct messaging, group staff chat |
| 👤 **Patient** | Browse specialists, book consultations, view medical vault, AI triage assistant |

### 🛠️ Core Functional Modules
- **💬 Isolated Direct Messaging** — Fixed message routing so doctor-patient conversations are fully private with no cross-leak
- **🤕 Interactive Symptoms Checker** — Smart triage widget guiding patients to the right specialist instantly
- **🔒 Logout Confirmation Modal** — Prevents accidental session termination with a secure confirm prompt
- **🧼 Clean Seeder Utility** — Admin-triggered DB reset clears all test data for a pristine environment
- **🧠 AI Triage (GPT-4)** — Intelligent health consultation with smart offline fallback responses
- **🌐 Multilingual** — Full English, Amharic (አማርኛ), and Afaan Oromoo support across all UI components
- **📊 System Analytics** — Real-time charts for appointments, patient counts, and revenue tracking

---

## 🛡️ Security Architecture

| Layer | Implementation |
|---|---|
| 🔐 **Authentication** | JWT tokens (24h expiry), Username-based login |
| 🔑 **Authorization** | RBAC — strict role separation enforced on every route |
| 🔒 **Password Storage** | bcrypt salted hashing — no plaintext ever stored |
| 🛡️ **SQL Safety** | Sequelize ORM with parameterized queries, no raw SQL |
| 🌐 **CORS** | Restricted to authorized frontend origins only |
| 🚫 **Registration** | Public registration disabled — admin-controlled onboarding only |

---

## 💻 Tech Stack & Tools

### Frontend
| Technology | Purpose |
|---|---|
| **React.js (Vite)** | Core SPA framework |
| **Tailwind CSS** | Utility-first premium styling |
| **Framer Motion** | Smooth animations & micro-interactions |
| **i18next** | Multilingual internationalization (EN / AM / OM) |
| **Lucide React** | Modern medical & dashboard iconography |
| **Recharts** | Admin analytics & data visualization |
| **React Router v6** | Client-side routing & protected role-based routes |
| **Socket.io Client** | Real-time messaging events |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js & Express** | REST API server with MVC architecture |
| **Sequelize ORM** | Schema migrations & safe DB operations |
| **MySQL** | Relational database for users, appointments & records |
| **Socket.io** | Bidirectional real-time messaging events |
| **OpenAI SDK (GPT-4)** | AI triage assistant with fallback support |
| **bcrypt** | Industry-standard password salting & hashing |
| **JWT** | Stateless secure session tokens |
| **Multer** | File & image upload handling |
| **Nodemailer** | Email notification integration |

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL Server running locally

### 1. Backend Setup
```bash
cd backend
npm install

# Create a .env file with:
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=yourpassword
# DB_NAME=sheger-health-connect
# JWT_SECRET=your_secret
# OPENAI_API_KEY=your_openai_key

npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed the Database
```bash
cd backend
node seed-admin.js
```

### 4. Default Login Credentials
| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@2026` |
| Doctor | `dr_abebe` | `Password@123` |
| Doctor | `dr_sarah` | `Password@123` |
| Doctor | `dr_dawit` | `Password@123` |

---

## ⚠️ System Limitations & Cloud Environment Notes

### 1. Free-Tier Cloud Database Expirations (Aiven / Render)
* **Limitation**: The live production backend hosted on Render connects to a free-tier Aiven MySQL cloud instance (`mysql-27ddad61-infosa2016batch-56af.c.aivencloud.com`). Because free cloud database tiers enforce strict inactivity pauses, DNS timeouts (`ENOTFOUND`), or trial expirations, live API requests on Render may occasionally fail to connect to the database.
* **Solution / Fallback**: We have engineered an **Automatic SQLite Fallback** into the backend. By setting `USE_SQLITE=true` in your environment or running locally, the platform instantly spins up a local file-based database (`sheger_health.sqlite`), guaranteeing 100% platform availability for local development, testing, and portfolio demonstrations without relying on external cloud providers.

### 2. OpenAI API Quota Limits
* **Limitation**: The AI Triage Assistant utilizes an OpenAI GPT-4 API key. If the assigned key exceeds its monthly billing quota or rate limits (`429 Too Many Requests`), live AI responses will be temporarily unavailable.
* **Solution / Fallback**: The frontend includes an advanced **Smart Offline Fallback Mechanism**. When the OpenAI API is unreachable or quota-exceeded, the system automatically intercepts the failure and serves pre-configured, board-certified clinical triage advice instantly.

---

## 📊 System Architecture
```
Frontend (React/Vite) ─── REST API ──► Backend (Express/Node.js)
        │                                        │
  Socket.io Client ◄──── WebSocket ────► Socket.io Server
                                                 │
                                        MySQL (via Sequelize)
```

---

## 🗂️ Documentation
All docs are inside the [`docs/`](docs/) folder:
- [api.md](docs/api.md) — REST API endpoints
- [database.md](docs/database.md) — Schema & models
- [deployment.md](docs/deployment.md) — Production deployment guide
- [features.md](docs/features.md) — Full feature list
- [installation.md](docs/installation.md) — Setup instructions
- [progress.md](docs/progress.md) — Development progress log
- [security.md](docs/security.md) — Security policies

---

<p align="center">© 2026 ShegerHealth · Designed & Developed by <strong>Gemachis Tesfaye</strong></p>
