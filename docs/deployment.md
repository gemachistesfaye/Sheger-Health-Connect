# 🚀 ShegerHealth - Production Deployment Guide

This guide details the end-to-end deployment architecture and procedures for hosting ShegerHealth in a live cloud environment. The platform utilizes a decoupled architecture, hosting the React Single Page Application (SPA) on **Vercel** and the Node.js Express REST API on **Render**, backed by a managed MySQL instance on **Aiven**.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        USER / CLIENT BROWSER                              │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ HTTPS / WebSocket
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                   VERCEL (Frontend SPA / React Vite)                      │
│             Domain: sheger-health-connect.vercel.app                      │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ API Requests / Socket.io
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│               RENDER (Backend REST API & Socket.io Server)                │
│             Domain: sheger-health-connect.onrender.com                    │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ Connection Pool / SSL
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                  AIVEN CLOUD MYSQL (Managed Database)                     │
│    Host: mysql-27ddad61-infosa2016batch-56af.c.aivencloud.com             │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🌍 1. Frontend Deployment (Vercel)

The React frontend is optimized and built using Vite. Vercel provides automated CI/CD pipelines linked directly to the GitHub repository.

### Build Configuration (`vercel.json`)
To ensure client-side routing via React Router v6 operates seamlessly without returning `404 Not Found` errors on direct page reloads, the root directory includes a `vercel.json` rewrite configuration:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Vercel Environment Variables
In the Vercel project dashboard (`Settings > Environment Variables`), configure the following key-value pairs:
```bash
VITE_API_URL=https://sheger-health-connect.onrender.com
VITE_SOCKET_URL=https://sheger-health-connect.onrender.com
```
*Note:* Ensure these point directly to the live Render backend URL, completely omitting trailing slashes.

---

## ⚙️ 2. Backend Deployment (Render)

The Express REST API and Socket.io WebSockets server are hosted as a Render Web Service.

### Render Build & Run Commands
- **Build Command:** `npm install` (executed within the `backend/` root directory)
- **Start Command:** `node server.js`

### Render Environment Variables
In the Render dashboard (`Environment > Secret Files / Environment Variables`), configure the production environment:

```bash
# Server & Environment
PORT=5000
NODE_ENV=production

# Frontend CORS Origin
CLIENT_URL=https://sheger-health-connect.vercel.app

# JWT Authentication Secret
JWT_SECRET=your_super_secret_production_jwt_key_here

# Aiven Cloud MySQL Credentials
DB_HOST=mysql-27ddad61-infosa2016batch-56af.c.aivencloud.com
DB_USER=avnadmin
DB_PASS=your_aiven_database_password
DB_NAME=sheger-health-connect
DB_PORT=25060

# OpenAI API Key (For AI Triage Assistant)
OPENAI_API_KEY=sk-proj-your_openai_production_api_key_here
```

---

## 🗄️ 3. Database Deployment & Fallback Architecture

### Managed Cloud Database (Aiven)
The live production database operates on Aiven's managed MySQL cloud infrastructure. It requires secure SSL connections, which are automatically handled by the Sequelize configuration in `backend/config/db.js`.

### ⚠️ Free-Tier Cloud Inactivity & Fallback Mechanism
Because free cloud database tiers (such as Aiven or Render free Postgres/MySQL instances) enforce inactivity pauses or temporary suspension, live API queries may occasionally encounter connection timeouts (`ENOTFOUND` or `ECONNREFUSED`).

**Engineered Solution:** To ensure 100% platform uptime and prevent demonstration failures during recruiter reviews, we have integrated an **Automatic SQLite Fallback Mechanism** into `backend/config/db.js`.
- If the external MySQL cloud database fails to connect or `USE_SQLITE=true` is declared in the environment, the backend instantly pivots to a local file-based SQLite database (`sheger_health.sqlite`).
- This guarantees flawless, uninterrupted API functionality regardless of cloud database status.

---

## 🔄 4. Continuous Integration & Deployment (CI/CD)

Both Vercel and Render are connected to the `main` branch of the GitHub repository.
1. **Code Commit:** Pushing changes to `origin main` automatically triggers deployment hooks.
2. **Frontend Pipeline:** Vercel installs dependencies, runs `vite build`, and deploys the static minified assets to the global CDN within seconds.
3. **Backend Pipeline:** Render pulls the latest commit, runs `npm install`, executes any pending Sequelize schema synchronizations, and restarts the Node.js server container.

---
*ShegerHealth · Production Deployment & Cloud Architecture Guide*
