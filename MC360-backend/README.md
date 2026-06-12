# MC360 Backend

Full-featured medical platform backend for MC360.

## Stack
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: Firebase + JWT (dual support)
- **Realtime**: Socket.IO (WebRTC signaling, queue, notifications, emergency)
- **Storage**: Cloudinary
- **Messaging**: Twilio (SMS + WhatsApp)
- **Email**: Nodemailer (Gmail/SMTP)
- **AI**: Anthropic Claude API
- **ML**: Python FastAPI (your models)
- **Jobs**: node-cron

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Required .env values
| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Min 32 chars, random string |
| `JWT_REFRESH_SECRET` | Different random string |
| `FIREBASE_PROJECT_ID` | From Firebase console |
| `FIREBASE_PRIVATE_KEY` | From Firebase service account JSON |
| `FIREBASE_CLIENT_EMAIL` | From Firebase service account JSON |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `TWILIO_ACCOUNT_SID` | From Twilio console |
| `TWILIO_AUTH_TOKEN` | From Twilio console |
| `TWILIO_PHONE_NUMBER` | Your Twilio number |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `ANTHROPIC_API_KEY` | From Anthropic console |
| `ML_API_URL` | URL of your Python ML model API |
| `CLIENT_URL` | Your frontend URL |

### 4. Run
```bash
# Development
npm run dev

# Production
npm start

# Test (server must be running)
node test.js
```

---

## API Base URL
```
http://localhost:5000/api/v1
```

## Endpoints Summary

| Module | Base Path |
|--------|-----------|
| Auth | `/api/v1/auth` |
| Patients | `/api/v1/patients` |
| Doctors | `/api/v1/doctors` |
| Hospitals | `/api/v1/hospitals` |
| Appointments | `/api/v1/appointments` |
| Tests | `/api/v1/tests` |
| Reports | `/api/v1/reports` |
| Prescriptions | `/api/v1/prescriptions` |
| Medicines | `/api/v1/medicines` |
| Health Metrics | `/api/v1/health-metrics` |
| AI Features | `/api/v1/ai` |
| Notifications | `/api/v1/notifications` |
| Queue | `/api/v1/queue` |
| Diet | `/api/v1/diet` |
| Emergency | `/api/v1/emergency` |
| Analytics | `/api/v1/analytics` |

## Auth
All protected routes require:
```
Authorization: Bearer <accessToken>
```
Firebase ID tokens are also accepted in the same header.

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_queue_room` | client→server | Join doctor's queue room |
| `queue_update` | server→client | Live queue position update |
| `join_video_room` | client→server | Join telemedicine session |
| `webrtc_offer/answer/ice_candidate` | both | WebRTC signaling |
| `end_video_call` | client→server | End video session |
| `notification` | server→client | New in-app notification |
| `emergency_alert` | server→client | Emergency broadcast |

## Roles
- `patient` — books appointments, tracks health, uses AI
- `doctor` — manages appointments, prescriptions, queue
- `hospital` — manages doctors, patients, analytics
- `admin` — full access