# 🏥 Sheger Health Connect — AI-Powered Healthcare Management Platform

## Overview
Sheger Health Connect is a production-ready, AI-powered digital healthcare management platform designed specifically for Ethiopian clinics and hospitals. It offers a scalable full-stack healthcare ecosystem featuring modern UI/UX, robust authentication, comprehensive appointment workflows, analytical dashboards, multilingual support, and an AI health assistant.

## Features
- **Public Clinic Website**: Modern, glassmorphism-inspired public pages showcasing services, clinic info, and emergency contacts.
- **Multilingual Support**: Available in English, Amharic, and Afaan Oromo.
- **Role-Based Dashboards**: Tailored workspaces for Patients, Doctors, Receptionists, and Admins.
- **Appointment System**: Real-time scheduling with doctor, department, and availability selection.
- **Medical Records**: Structured digital records tracking allergies, diagnoses, prescriptions, and lab results.
- **Enterprise Analytics**: Admin dashboard with Recharts-powered analytics for revenue, patient growth, and department demand.
- **AI Health Assistant**: Gemini API integration for symptom guidance and clinic FAQs.

## Tech Stack
- **Frontend**: React, Vite, JavaScript, Tailwind CSS, Shadcn UI, React Router, React Query, Recharts.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MySQL/PostgreSQL (configured via backend).
- **AI Integration**: Google Gemini API.

## Folder Structure
```txt
src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── dashboard/
 ├── services/
 ├── hooks/
 ├── context/
 ├── routes/
 ├── utils/
 ├── api/
 ├── assets/
 ├── translations/

backend/
 ├── controllers/
 ├── routes/
 ├── middleware/
 ├── models/
 ├── config/
 ├── utils/
 ├── services/
 └── database/
```

## Installation & Setup
1. Clone the repository.
2. Run `npm install` to install frontend dependencies.
3. Start the frontend server with `npm run dev`.

*(Backend setup and API configurations will be detailed in `docs/SETUP_GUIDE.md`)*

## Future Roadmap
- Integration with external labs and pharmacies.
- Telemedicine video consultation support.
- Mobile application using React Native.
