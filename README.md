# 🏥 MC360 — Connected Healthcare Platform

<p align="center">
  <b>A modern AI-powered healthcare ecosystem connecting Patients, Doctors, and Hospitals through real-time digital healthcare services.</b>
</p>

MC360 is a full-stack healthcare platform designed to simplify healthcare access and hospital operations.  
It provides appointment management, emergency communication, medicine tracking, online consultations, analytics dashboards, and secure authentication.

Built by:
- **Shubham Chakma**
- **Shivam**
- **Anuradha**

---

# 🚀 Features

## 👥 Multi-Role Healthcare System

MC360 supports three major user roles:

### 🧑 Patient
- Create and manage health profile
- Book doctor appointments
- Track prescriptions
- Medicine reminders
- Upload medical documents
- Emergency SOS support
- Health analytics dashboard

### 👨‍⚕️ Doctor
- Manage appointments
- View patient information
- Handle consultations
- Access medical history
- Manage availability

### 🏥 Hospital Admin
- Hospital operation dashboard
- Monitor available beds
- Track doctors
- Patient check-in analytics
- Emergency alert monitoring

---

# ⚡ Core Functionalities

## 🔐 Authentication
- Firebase Google Authentication
- Firebase Admin SDK verification
- JWT-based session handling
- Role-based authorization

## 📅 Appointment System
- Doctor discovery
- Appointment booking
- Status tracking
- Automated reminders

## 🚨 Emergency SOS System
Real-time emergency communication:
- SOS trigger
- Hospital alert broadcasting
- Emergency contact notifications
- Socket.IO live updates

## 💊 Medicine Management
- Medicine schedules
- Automated reminders
- Medication adherence tracking

## 📊 Hospital Analytics
Dynamic dashboards showing:
- Active doctors
- Available beds
- Daily patients
- Department statistics

## 💬 Real-Time Communication
Powered by Socket.IO:
- Instant emergency broadcasts
- Live dashboard updates
- Real-time notifications

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
| :--- | :--- |
| **React.js + Vite** | Frontend framework |
| **Tailwind CSS** | UI styling |
| **Zustand** | Global state management |
| **TanStack Query** | Server state caching |
| **Recharts** | Analytics visualization |
| **Lucide React** | Icons |

---

## Backend

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Runtime |
| **Express.js** | API server |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **Firebase Admin SDK** | Authentication |
| **JWT** | Authorization |
| **Socket.IO** | Real-time communication |
| **Cloudinary** | File/image storage |
| **Twilio** | SMS & WhatsApp alerts |
| **Node Cron** | Background jobs |

---

# 🏗️ System Architecture

```text
             ┌─────────────────┐
             │    React App    │
             └────────┬────────┘
                      │
                      │
             REST API + Socket.IO
                      │
                      │
             ┌────────▼────────┐
             │ Express Backend │
             └────────┬────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌───────┐         ┌────────┐      ┌──────────┐
│MongoDB│         │Firebase│      │Cloudinary│
└───────┘         └────────┘      └──────────┘
Database         Auth System      File Storage
                      │
                      ▼
              ┌───────────────┐
              │Twilio Services│
              └───────────────┘
         SMS / WhatsApp Notifications
```

---

# 📂 Project Structure

```text
MC360/
│
├── MC360-backend/
│   └── src/
│       ├── config/          # Database, Firebase, Cloudinary, Twilio config
│       ├── controllers/     # Route handler controllers (auth, hospital, patient, etc.)
│       ├── models/          # Mongoose Schemas (User, Patient, Doctor, Hospital, Alert, etc.)
│       ├── routes/          # Express API route declarations
│       ├── services/        # Business logic layers (auth, notifications, queue)
│       ├── sockets/         # Real-time WebSocket handlers
│       ├── jobs/            # Background tasks (Node-Cron)
│       └── utils/           # Helper libraries (encryption, emails, logging)
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

# ⚙️ Installation

## Requirements
Ensure you have the following installed:
- **Node.js** (v18+)
- **MongoDB** (Local instance or MongoDB Atlas account)
- **Firebase Project** (For authentication)
- **Cloudinary Account** (For image/file storage)
- **Twilio Account** (For SMS/WhatsApp alerts)

---

## Backend Setup

1. **Clone the repository** (if not already cloned):
   ```bash
   git clone <repository-url>
   cd MC360
   ```

2. **Navigate to the backend directory and install dependencies**:
   ```bash
   cd MC360-backend
   npm install
   ```

3. **Create the environment variables file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT Keys
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d

   # Firebase Setup
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email

   # Cloudinary Setup
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   # Twilio Setup
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

   # AI / ML Setup (Optional)
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

5. **Start the backend development server**:
   ```bash
   npm run dev
   ```

---

## Frontend Setup

1. **Navigate to the frontend directory and install dependencies**:
   ```bash
   cd ../MC360-frontend
   npm install
   ```

2. **Create the environment variables file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file**:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_SOCKET_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

---

# 🌐 Deployment

MC360 can be deployed using the following platforms:

- **Frontend**: Vercel, Netlify, or Render Static Hosting.
- **Backend**: Render, Railway, AWS, or Heroku.
- **Production Architecture**:
  ```text
  Frontend (Vercel) ──► Backend API (Render/Railway) ──► MongoDB Atlas
                                                ├──► Firebase Auth
                                                ├──► Cloudinary
                                                └──► Twilio Services
  ```

---

# 🔒 Security Features

MC360 is built with security best practices:
- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Mongo Sanitization**: Prevents MongoDB Query Injection attacks.
- **HTTP Parameter Pollution Protection**: Guards against parameter pollution attacks.
- **Rate Limiting**: Protects APIs from brute-force/DDOS attacks.
- **JWT Verification**: Secures all private API endpoints.
- **Firebase Token Validation**: Verifies client authentication tokens securely via Firebase Admin SDK.
- **CORS Protection**: restircts unauthorized cross-origin requests.

---

# 📡 API Base URL

- **Development Base URL**: `http://localhost:5000/api/v1`
- **Health Check**:
  - **Endpoint**: `GET /health` or `GET /api/v1/health`
  - **Response**:
    ```json
    {
      "status": "ok"
    }
    ```

---

# 🔮 Future Improvements

- AI Symptom Checker
- Telemedicine Video Consultation
- AI Medical Report Analysis
- Health Prediction Models
- Mobile Application

---

# 📄 License

This project is proprietary. All rights reserved.

---

<p align="center">
  <b>❤️ Developed For Better Healthcare</b><br>
  MC360 aims to make healthcare more accessible, connected, and efficient through technology.
</p>
