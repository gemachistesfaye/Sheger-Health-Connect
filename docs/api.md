# 🔌 ShegerHealth - REST API Documentation

The ShegerHealth backend provides a robust, RESTful API built with Node.js, Express, and Sequelize. All protected routes require a valid JSON Web Token (JWT) passed in the `Authorization` header.

```
Base API URL: /api
Headers: { "Authorization": "Bearer <JWT_TOKEN>" }
```

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user (Admin, Doctor, or Patient) using their username and password.
- **Request Body:**
  ```json
  {
    "username": "dr_abebe",
    "password": "Password@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "full_name": "Dr. Abebe Bekele",
      "username": "dr_abebe",
      "role": "Doctor",
      "specialization": "Cardiology"
    }
  }
  ```

### `POST /api/auth/forgot-password`
Initiates the password recovery workflow by generating a time-bound reset token.
- **Request Body:** `{ "email": "abebe@shegerhealth.com" }`
- **Response (200 OK):** `{ "success": true, "message": "Password reset token sent" }`

### `PUT /api/auth/reset-password/:token`
Resets the user's password using the recovery token.
- **Request Body:** `{ "password": "NewPassword@2026" }`
- **Response (200 OK):** `{ "success": true, "message": "Password updated successfully" }`

---

## 👨‍⚕️ 2. Doctor Endpoints (`/api/doctors`)

### `GET /api/doctors`
Retrieves a public directory of all active, onboarded specialists.
- **Auth Required:** No (Public Route)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": 2,
        "full_name": "Dr. Abebe Bekele",
        "specialization": "Cardiology",
        "email": "abebe@shegerhealth.com",
        "phone": "+251911234567"
      }
    ]
  }
  ```

---

## 📅 3. Appointment Endpoints (`/api/appointments`)

### `POST /api/appointments`
Books a new consultation appointment with a specific doctor.
- **Auth Required:** Yes (Patient)
- **Request Body:**
  ```json
  {
    "doctor_id": 2,
    "appointment_date": "2026-05-20T10:00:00.000Z",
    "reason": "Routine cardiac checkup and blood pressure monitoring."
  }
  ```

### `GET /api/appointments`
Retrieves appointments for the authenticated user (Doctors see their schedule; Patients see their bookings).
- **Auth Required:** Yes (Doctor, Patient)

### `PUT /api/appointments/:id/status`
Updates appointment status (`Scheduled`, `Completed`, `Cancelled`).
- **Auth Required:** Yes (Doctor, Admin)
- **Request Body:** `{ "status": "Completed" }`

---

## 💬 4. Messaging Endpoints (`/api/messages`)

### `GET /api/messages/:userId`
Retrieves the isolated direct conversation history between the authenticated user and the specified `userId`.
- **Auth Required:** Yes (All Roles)

### `POST /api/messages`
Sends a secure, direct chat message to another user.
- **Auth Required:** Yes (All Roles)
- **Request Body:**
  ```json
  {
    "receiver_id": 3,
    "content": "Please review the latest ECG results attached in your medical vault."
  }
  ```

---

## 🧠 5. AI Triage Endpoints (`/api/ai`)

### `POST /api/ai/triage`
Submits patient symptoms to the AI Triage Assistant (GPT-4) for preliminary assessment and specialist recommendation.
- **Auth Required:** Yes (Patient)
- **Request Body:** `{ "symptoms": "Severe chest pain radiating to the left arm, shortness of breath." }`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "triage": {
      "urgency": "High",
      "recommended_specialist": "Cardiology",
      "advice": "Seek immediate emergency medical attention. These symptoms may indicate an acute coronary event."
    }
  }
  ```

---

## 🔑 6. Admin Management Endpoints (`/api/admins`)

### `GET /api/admins/stats`
Retrieves platform-wide analytics for the admin dashboard.
- **Auth Required:** Yes (Admin Only)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalDoctors": 12,
      "totalPatients": 145,
      "totalAppointments": 320,
      "totalRevenue": 45000
    }
  }
  ```

### `POST /api/admins/doctors`
Onboards a new doctor into the system.
- **Auth Required:** Yes (Admin Only)
- **Request Body:**
  ```json
  {
    "full_name": "Dr. Sarah Tadesse",
    "username": "dr_sarah",
    "email": "sarah@shegerhealth.com",
    "password": "Password@123",
    "specialization": "Pediatrics",
    "phone": "+251911987654"
  }
  ```

### `POST /api/admins/seed-reset`
Wipes out temporary test data and resets the database to a clean, pristine state.
- **Auth Required:** Yes (Admin Only)
- **Response (200 OK):** `{ "success": true, "message": "Database successfully reset and seeded." }`

---
*ShegerHealth · REST API Reference*
