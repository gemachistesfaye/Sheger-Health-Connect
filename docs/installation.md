# ⚙️ Sheger Health Connect - Local Setup & Installation Guide

This guide provides step-by-step instructions for setting up, configuring, and running Sheger Health Connect on your local development machine.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your system before proceeding:
- **Node.js:** v20.0.0 or higher (includes `npm`)
- **Git:** For cloning the repository
- **MySQL Server:** v8.0+ running locally (Optional if utilizing the built-in SQLite fallback)

---

## 📥 1. Clone the Repository

Open your terminal or command prompt and clone the project repository:
```bash
git clone https://github.com/gemachistesfaye/sheger-health-connect.git
cd sheger-health-connect
```

---

## ⚙️ 2. Backend Setup & Configuration

The backend is an Express REST API utilizing Sequelize ORM.

### Install Dependencies
Navigate into the `backend/` directory and install the necessary Node packages:
```bash
cd backend
npm install
```

### Environment Configuration (`.env`)
Create a `.env` file in the root of the `backend/` directory and configure the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend CORS Origin
CLIENT_URL=http://localhost:5173

# JWT Authentication Secret (Replace with a secure random string)
JWT_SECRET=super_secret_development_jwt_key_2026

# Local MySQL Database Credentials
DB_HOST=localhost
DB_USER=root
DB_PASS=your_local_mysql_password
DB_NAME=sheger-health-connect
DB_PORT=3306

# SQLite Fallback Mode (Set to true to bypass MySQL entirely)
USE_SQLITE=true

# OpenAI API Key (For AI Triage Assistant)
OPENAI_API_KEY=your_openai_api_key_here
```

### Start the Backend Server
Run the development server using Nodemon (restarts automatically on code changes):
```bash
npm run dev
```
*Expected Output:*
```
[SERVER] Running in development mode on port 5000
[DATABASE] SQLite Fallback active / MySQL connected successfully
[SEQUELIZE] Database tables synchronized.
```

---

## 💻 3. Frontend Setup & Configuration

The frontend is a React Single Page Application built with Vite and Tailwind CSS.

### Install Dependencies
Open a new terminal window, navigate to the `frontend/` directory, and install dependencies:
```bash
cd frontend
npm install
```

### Environment Configuration (`.env`)
Create a `.env` file in the root of the `frontend/` directory:
```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Start the Frontend Development Server
Launch the Vite development server:
```bash
npm run dev
```
*Expected Output:*
```
  VITE v5.0.0  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌱 4. Database Seeding & Verification

To populate your local database with initial administrator accounts, sample doctors, and mock patient appointments, execute the built-in database seeder.

Open a terminal in the `backend/` directory and run:
```bash
node seed-database.js
```
*Expected Output:*
```
[SEEDER] Wiping existing tables...
[SEEDER] Admin account created (admin)
[SEEDER] Sample doctors provisioned (dr_abebe, dr_sarah, dr_dawit)
[SEEDER] Sample appointments and medical records created.
[SEEDER] Database seeding completed successfully!
```

---

## 🔐 5. Default Login Credentials

Use the following pre-configured credentials to explore the platform across different role perspectives:

| Role | Username | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin` | `Admin@2026` | Full platform control, logs, doctor onboarding. |
| **Doctor** | `dr_abebe` | `Password@123` | Doctor dashboard, patient records, direct chat. |
| **Doctor** | `dr_sarah` | `Password@123` | Doctor dashboard, patient records, direct chat. |
| **Doctor** | `dr_dawit` | `Password@123` | Doctor dashboard, patient records, direct chat. |
| **Patient**| `patient_demo`| `Password@123` | Patient booking, AI triage, medical vault. |

---
*Sheger Health Connect · Local Setup & Installation Guide*
