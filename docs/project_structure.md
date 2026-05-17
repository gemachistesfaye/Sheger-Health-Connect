# 🗂️ Sheger Health Connect - Codebase & Project Structure

Sheger Health Connect is structured as a full-stack monorepo containing two distinct primary environments: a Node.js/Express backend (`backend/`) and a React/Vite frontend (`frontend/`). This architecture ensures clean separation of concerns while maintaining streamlined version control.

```
sheger-health-connect/
│
├── backend/                    # Express REST API & Socket.io Server
│   ├── config/                 # Database & Environment Configurations
│   │   └── db.js               # Sequelize MySQL / SQLite Fallback initialization
│   │
│   ├── controllers/            # Core Business Logic & Request Handlers
│   │   ├── adminController.js  # Admin analytics, logs, doctor onboarding
│   │   ├── aiController.js     # GPT-4 triage integration & fallback
│   │   ├── appointmentController.js # Consultation booking & status updates
│   │   ├── authController.js   # JWT generation, login, password recovery
│   │   ├── doctorController.js # Specialist directory fetching
│   │   ├── medicalRecordController.js # Medical vault management
│   │   ├── messageController.js # Direct & group chat routing
│   │   └── paymentController.js # Billing & transaction tracking
│   │
│   ├── middleware/             # Express Request Interceptors
│   │   └── authMiddleware.js   # JWT verification (`protect`) & RBAC (`authorize`)
│   │
│   ├── models/                 # Sequelize ORM Schema Definitions
│   │   ├── Appointment.js      # Appointments table schema
│   │   ├── MedicalRecord.js    # Patient medical notes & attachments schema
│   │   ├── Message.js          # Chat communications schema
│   │   ├── Payment.js          # Billing transactions schema
│   │   └── User.js             # RBAC Users table schema
│   │
│   ├── routes/                 # Express REST API Route Declarations
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   ├── messageRoutes.js
│   │   └── paymentRoutes.js
│   │
│   ├── app.js                  # Express middleware & route mounting
│   ├── server.js               # HTTP Server & Socket.io WebSockets initialization
│   ├── seed-database.js        # Automated DB seeder utility
│   └── package.json            # Backend dependencies & scripts
│
├── frontend/                   # React Single Page Application (Vite)
│   ├── public/                 # Static assets & icons
│   │
│   ├── src/                    # React Application Source Code
│   │   ├── assets/             # Brand graphics & styling resources
│   │   │
│   │   ├── components/         # Reusable UI Building Blocks
│   │   │   ├── AppointmentBooking.jsx # Interactive booking widget
│   │   │   ├── Banner.jsx      # Landing page cinematic hero banner
│   │   │   ├── DoctorCard.jsx  # Specialist directory display card
│   │   │   ├── Footer.jsx      # SaaS-style platform footer
│   │   │   ├── LogoutConfirmModal.jsx # Secure session termination modal
│   │   │   ├── Navbar.jsx      # Responsive navigation & role indicators
│   │   │   ├── QuickSymptoms.jsx # Interactive triage symptom widget
│   │   │   └── TriageAI.jsx    # GPT-4 triage consultation interface
│   │   │
│   │   ├── context/            # React Context Providers
│   │   │   └── AuthContext.jsx # Global auth state, JWT persistence, role redirects
│   │   │
│   │   ├── i18n/               # Multilingual Configuration (i18next)
│   │   │   └── i18n.js         # EN / AM / OM translation bundles
│   │   │
│   │   ├── pages/              # Dedicated Route Views
│   │   │   ├── AdminDashboard.jsx # Admin analytics & control center
│   │   │   ├── AppointmentsPage.jsx # Doctor & Patient schedule view
│   │   │   ├── DoctorsPage.jsx # Public specialist directory page
│   │   │   ├── ForgotPassword.jsx # Password recovery initiation view
│   │   │   ├── Landing.jsx     # Marketing & triage landing experience
│   │   │   ├── Login.jsx       # Username/Password auth gateway
│   │   │   ├── MessagesPage.jsx # Real-time clinical chat interface
│   │   │   ├── PatientDashboard.jsx # Patient medical vault & booking center
│   │   │   └── ResetPassword.jsx # Token-based password update view
│   │   │
│   │   ├── App.jsx             # Root component & route hierarchy
│   │   ├── index.css           # Tailwind CSS global directives & premium styling
│   │   └── main.jsx            # React DOM attachment & context wrapping
│   │
│   ├── index.html              # HTML SPA entry point
│   ├── package.json            # Frontend dependencies & scripts
│   ├── tailwind.config.js      # Tailwind utility customizations & theme tokens
│   └── vite.config.js          # Vite bundler & development server config
│
├── docs/                       # Comprehensive Platform Documentation
│   ├── api.md                  # REST API Endpoints reference
│   ├── database.md             # Schema & relational models
│   ├── deployment.md           # Vercel & Render production deployment guide
│   ├── features.md             # Detailed platform feature catalog
│   ├── installation.md         # Local setup & seeding instructions
│   ├── progress.md             # Development milestone tracking
│   ├── project_structure.md    # Codebase architectural breakdown
│   └── security.md             # Security architecture & RBAC policies
│
├── SECURITY.md                 # GitHub Security tab policy & vulnerability disclosure
├── README.md                   # Main GitHub repository landing documentation
├── vercel.json                 # Vercel SPA routing rewrite rules
└── .gitignore                  # Git untracked files & directories
```

---

## 🏛️ Architectural Flow

1. **Client Interaction:** Users interact with the React components in `frontend/src/`. State is managed via `AuthContext.jsx` and local React hooks.
2. **API Requests:** Axios/Fetch requests are dispatched to the Express backend routes defined in `backend/routes/`.
3. **Middleware Interception:** Requests to protected endpoints are intercepted by `backend/middleware/authMiddleware.js` to verify JWT validity and RBAC permissions.
4. **Controller Execution:** Validated requests are processed by dedicated controllers in `backend/controllers/`.
5. **Database Interaction:** Controllers execute queries against the MySQL/SQLite database using Sequelize ORM models defined in `backend/models/`.
6. **Real-Time Synchronization:** Chat messages trigger Socket.io events in `backend/server.js`, broadcasting updates instantly to active client sockets in `frontend/src/pages/MessagesPage.jsx`.

---
*Sheger Health Connect · Codebase & Project Structure Reference*
