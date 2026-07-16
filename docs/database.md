# 🗄️ ShegerHealth - Database Architecture & Schema

ShegerHealth utilizes a relational MySQL database managed via the Sequelize Object-Relational Mapper (ORM). The database is structured to maintain strict relational integrity, secure patient records, and streamline appointment scheduling.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              USERS TABLE                                  │
│  (id, full_name, username, email, password_hash, role, specialization)    │
└─────────────────────┬───────────────────────────────┬─────────────────────┘
                      │ 1:M                           │ 1:M
                      ▼                               ▼
┌──────────────────────────────────────────┐   ┌────────────────────────────┐
│           APPOINTMENTS TABLE             │   │       MESSAGES TABLE       │
│ (id, doctor_id, patient_id, date, status)│   │ (id, sender_id, receiver_id│
└─────────────────────┬────────────────────┘   │      content, timestamp)   │
                      │ 1:1                    └────────────────────────────┘
                      ▼
┌──────────────────────────────────────────┐
│          MEDICAL RECORDS TABLE           │
│ (id, appointment_id, diagnosis, notes,   │
│              file_path)                  │
└──────────────────────────────────────────┘
```

---

## 📋 Table Definitions

### 1. `Users` Table
Stores all platform users across the three primary roles (`Admin`, `Doctor`, `Patient`).

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto-Increment | Unique user identifier. |
| `full_name` | VARCHAR(100) | Not Null | User's complete legal or professional name. |
| `username` | VARCHAR(50) | Not Null, Unique | Unique identifier used for authentication. |
| `email` | VARCHAR(100) | Unique, Nullable | Email address for notifications and password recovery. |
| `phone` | VARCHAR(20) | Nullable | Contact telephone number. |
| `password_hash` | VARCHAR(255) | Not Null | `bcrypt`-hashed password string. |
| `role` | ENUM | Not Null, Default 'Patient' | Tier access: `'Admin'`, `'Doctor'`, or `'Patient'`. |
| `banned` | BOOLEAN | Not Null, Default `false` | Administrative restriction flag. |
| `specialization` | VARCHAR(100) | Nullable | Medical expertise (applicable to Doctors only). |
| `resetPasswordToken`| VARCHAR(255) | Nullable | Cryptographic token for password recovery. |
| `resetPasswordExpire`| DATE | Nullable | Expiration timestamp for reset token. |
| `created_at` | TIMESTAMP | Automatic | Record creation timestamp. |
| `updated_at` | TIMESTAMP | Automatic | Record modification timestamp. |

---

### 2. `Appointments` Table
Manages consultation schedules between patients and physicians.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto-Increment | Unique appointment identifier. |
| `patient_id` | INTEGER | Foreign Key (`Users.id`) | Reference to the booking Patient. |
| `doctor_id` | INTEGER | Foreign Key (`Users.id`) | Reference to the assigned Doctor. |
| `appointment_date`| DATETIME | Not Null | Scheduled consultation date and time. |
| `reason` | TEXT | Not Null | Patient's stated symptoms or visit objective. |
| `status` | ENUM | Default 'Scheduled' | Current state: `'Scheduled'`, `'Completed'`, `'Cancelled'`. |
| `created_at` | TIMESTAMP | Automatic | Booking timestamp. |
| `updated_at` | TIMESTAMP | Automatic | Status modification timestamp. |

---

### 3. `Messages` Table
Stores secure direct and group chat communications between platform users.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto-Increment | Unique message identifier. |
| `sender_id` | INTEGER | Foreign Key (`Users.id`) | User who initiated the message. |
| `receiver_id` | INTEGER | Foreign Key (`Users.id`), Nullable | Target user (null if group broadcast). |
| `content` | TEXT | Not Null | Encrypted/sanitized message body. |
| `is_group` | BOOLEAN | Default `false` | Flag indicating a staff group broadcast. |
| `created_at` | TIMESTAMP | Automatic | Timestamp of message transmission. |

---

### 4. `MedicalRecords` Table
Stores clinical notes, diagnoses, and attached lab/imaging files resulting from appointments.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto-Increment | Unique medical record identifier. |
| `patient_id` | INTEGER | Foreign Key (`Users.id`) | Associated Patient. |
| `doctor_id` | INTEGER | Foreign Key (`Users.id`) | Creating Doctor. |
| `appointment_id`| INTEGER | Foreign Key (`Appointments.id`) | Linking consultation appointment. |
| `diagnosis` | VARCHAR(255) | Not Null | Primary clinical diagnosis. |
| `prescription` | TEXT | Nullable | Prescribed medication details. |
| `notes` | TEXT | Nullable | Physician's clinical examination notes. |
| `attachment_url`| VARCHAR(255) | Nullable | Secure URL to uploaded lab results or imaging files. |
| `created_at` | TIMESTAMP | Automatic | Record creation timestamp. |

---

### 5. `Payments` Table
Tracks administrative billing and consultation fee transactions.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto-Increment | Unique payment transaction identifier. |
| `appointment_id`| INTEGER | Foreign Key (`Appointments.id`) | Associated appointment. |
| `patient_id` | INTEGER | Foreign Key (`Users.id`) | Paying Patient. |
| `amount` | DECIMAL(10,2) | Not Null | Monetary value in ETB. |
| `payment_method`| ENUM | Default 'Chapa' | Gateway used: `'Chapa'`, `'Telebirr'`, `'Cash'`. |
| `status` | ENUM | Default 'Pending' | Transaction state: `'Pending'`, `'Completed'`, `'Failed'`. |
| `transaction_id`| VARCHAR(100) | Unique, Nullable | Gateway reference code. |
| `created_at` | TIMESTAMP | Automatic | Transaction timestamp. |

---

## 🔗 Relational Associations (Sequelize ORM)

```javascript
// User Associations
User.hasMany(Appointment, { foreignKey: 'patient_id', as: 'patientAppointments' });
User.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'doctorAppointments' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });

// Appointment Associations
Appointment.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
Appointment.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });
Appointment.hasOne(MedicalRecord, { foreignKey: 'appointment_id', as: 'medicalRecord' });
Appointment.hasOne(Payment, { foreignKey: 'appointment_id', as: 'payment' });

// MedicalRecord Associations
MedicalRecord.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
MedicalRecord.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
```

---
*ShegerHealth · Database Architecture & Schema Reference*
