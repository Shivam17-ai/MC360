# MC360 — Connected Healthcare Platform

MC360 is a modern, premium, and feature-rich digital healthcare platform designed to bridge patients, doctors, and hospitals. It provides real-time services including appointment booking, online consultations, medicine reminders, emergency SOS broadcasts, and operation analytics.

Developed by **Shubham Chakma**, **Shivam**, and **Anuradha** for better healthcare.

---

## 🚀 Key Features

- **Multi-Role Dashboards**: Customized interfaces for Patients, Doctors, and Hospital Administrators.
- **Dynamic Hospital Operations**: Monitor available beds, active doctors, daily patient check-ins, and department breakdown with dynamic analytics.
- **Real-Time Emergency Monitor**: Instantly trigger SOS alerts, notify emergency contacts via SMS/WhatsApp, and broadcast alerts in real-time to the hospital.
- **Firebase Google Sign-In**: Simple, secured cross-origin Google authentication.
- **Prescriptions & Medicine Schedules**: Manage medical histories, log adherence, and receive automated reminders.
- **Socket.io Integration**: Live socket connections for active communication and instant alert broadcasts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & Modern Glassmorphic UI Aesthetics
- **State Management**: TanStack React Query (query caching)
- **Icons**: Lucide React
- **Charts**: Recharts (for analytics and trends visualization)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: Firebase Admin SDK & JSON Web Tokens (JWT)
- **Communications**: Twilio SMS & WhatsApp APIs
- **Storage**: Cloudinary (for profile photos, medical records, and logos)
- **Background Work**: Node-Cron jobs for medicine/appointment reminders

---

## ⚙️ Project Setup

### Prerequisites
- Node.js v18+ installed
- MongoDB database (local or MongoDB Atlas connection string)
- Firebase project credentials

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MC360
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd MC360-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, Firebase creds, Twilio keys, etc.).
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../MC360-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update `VITE_API_URL` to point to your backend server (usually `http://localhost:5000/api/v1`).
5. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
MC360/
├── MC360-backend/
│   ├── src/
│   │   ├── config/          # Database, Firebase, Cloudinary, Twilio config
│   │   ├── controllers/     # Route handler controllers (auth, hospital, patient, etc.)
│   │   ├── models/          # Mongoose Schemas (User, Patient, Doctor, Hospital, Alert, etc.)
│   │   ├── routes/          # Express API route declarations
│   │   ├── services/        # Business logic layers (auth, notifications, queue)
│   │   ├── sockets/         # Real-time WebSocket handlers
│   │   └── utils/           # Helper libraries (encryption, emails, logging)
│   └── server.js            # Server entry point
│
└── MC360-frontend/
    ├── src/
    │   ├── components/      # Common components (cards, avatars, guards, buttons)
    │   ├── layouts/         # Layout configurations (HospitalLayout, PatientLayout)
    │   ├── pages/           # Application views (HospitalDashboard, Register, etc.)
    │   ├── services/        # Axios API integration service
    │   └── store/           # Global state stores (Zustand)
```

---

## 📄 License
This project is proprietary. All rights reserved.
