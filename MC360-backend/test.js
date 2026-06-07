import { sendWhatsAppMessage } from './src/services/whatsapp.service.js'
import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api'
let accessToken = ''

// ── Helpers ───────────────────────────────────────────────────────────────────
const log = (label, data) => {
  console.log(`\n✅ ${label}`)
  console.log(JSON.stringify(data, null, 2))
}

const err = (label, error) => {
  console.log(`\n❌ ${label}`)
  console.log(error?.response?.data || error.message)
}

// ── 1. WhatsApp ───────────────────────────────────────────────────────────────
const testWhatsApp = async () => {
  try {
    await sendWhatsAppMessage(
      '+91YOURNUMBER',
      'Hello from MedConnect360 🚀'
    )
    log('WhatsApp Message', { sent: true, to: '+91YOURNUMBER' })
  } catch (e) {
    err('WhatsApp Message', e)
  }
}

// ── 2. Health Check ───────────────────────────────────────────────────────────
const testHealth = async () => {
  try {
    const res = await axios.get('http://localhost:8000/health')
    log('Server Health Check', res.data)
  } catch (e) {
    err('Server Health Check', e)
  }
}

// ── 3. Register ───────────────────────────────────────────────────────────────
const testRegister = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name:     'Test Patient',
      email:    'testpatient@mc360.com',
      phone:    '9876543210',
      password: 'Test@1234',
      role:     'patient',
    })
    log('Register', res.data)
    accessToken = res.data.data.accessToken
  } catch (e) {
    err('Register', e)
  }
}

// ── 4. Login ──────────────────────────────────────────────────────────────────
const testLogin = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email:    'testpatient@mc360.com',
      password: 'Test@1234',
    })
    log('Login', res.data)
    accessToken = res.data.data.accessToken
  } catch (e) {
    err('Login', e)
  }
}

// ── 5. Get Me ─────────────────────────────────────────────────────────────────
const testGetMe = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Get Me', res.data)
  } catch (e) {
    err('Get Me', e)
  }
}

// ── 6. Get Patient Profile ────────────────────────────────────────────────────
const testGetProfile = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/patient/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Get Patient Profile', res.data)
  } catch (e) {
    err('Get Patient Profile', e)
  }
}

// ── 7. Get All Doctors ────────────────────────────────────────────────────────
const testGetDoctors = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/doctor`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Get All Doctors', res.data)
  } catch (e) {
    err('Get All Doctors', e)
  }
}

// ── 8. Book Appointment ───────────────────────────────────────────────────────
const testBookAppointment = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/appointment/book`, {
      doctorId: 'REPLACE_WITH_REAL_DOCTOR_ID',
      date:     '2024-12-25',
      time:     '10:00 AM',
      type:     'in-person',
      reason:   'Routine checkup',
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Book Appointment', res.data)
  } catch (e) {
    err('Book Appointment', e)
  }
}

// ── 9. Get My Appointments ────────────────────────────────────────────────────
const testGetAppointments = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/appointment/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Get My Appointments', res.data)
  } catch (e) {
    err('Get My Appointments', e)
  }
}

// ── 10. Add Medicine ──────────────────────────────────────────────────────────
const testAddMedicine = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/medicine`, {
      name:      'Metformin',
      dose:      '500mg',
      frequency: 'Twice Daily',
      times:     ['8:00 AM', '8:00 PM'],
      startDate: new Date().toISOString(),
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Add Medicine', res.data)
  } catch (e) {
    err('Add Medicine', e)
  }
}

// ── 11. Check Drug Interactions ───────────────────────────────────────────────
const testDrugInteraction = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/ai/drug-interaction`, {
      drugs:       ['Metformin', 'Aspirin', 'Amlodipine'],
      patientInfo: { age: 26, conditions: ['Diabetes'], allergies: [] },
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Drug Interaction Check', res.data)
  } catch (e) {
    err('Drug Interaction Check', e)
  }
}

// ── 12. Symptom Checker ───────────────────────────────────────────────────────
const testSymptomChecker = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/ai/symptoms`, {
      symptoms:       ['fever', 'headache', 'body ache'],
      patientContext: { age: 26, gender: 'male', medicalHistory: [] },
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Symptom Checker', res.data)
  } catch (e) {
    err('Symptom Checker', e)
  }
}

// ── 13. Add Health Metric ─────────────────────────────────────────────────────
const testAddMetric = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/health-metric`, {
      type:  'blood_pressure',
      value: { systolic: 120, diastolic: 80 },
      unit:  'mmHg',
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Add Health Metric', res.data)
  } catch (e) {
    err('Add Health Metric', e)
  }
}

// ── 14. Generate Diet Plan ────────────────────────────────────────────────────
const testDietPlan = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/diet/generate`, {
      name:          'Test Patient',
      age:           26,
      gender:        'male',
      weight:        72,
      height:        175,
      conditions:    ['Diabetes'],
      allergies:     [],
      goal:          'Manage blood sugar',
      activityLevel: 'Moderate',
      preference:    'Vegetarian',
      region:        'India',
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Generate Diet Plan', res.data)
  } catch (e) {
    err('Generate Diet Plan', e)
  }
}

// ── 15. Get Notifications ─────────────────────────────────────────────────────
const testGetNotifications = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/notification`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Get Notifications', res.data)
  } catch (e) {
    err('Get Notifications', e)
  }
}

// ── 16. Book Lab Test ─────────────────────────────────────────────────────────
const testBookTest = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/test/book`, {
      tests: [
        { name: 'CBC', category: 'Blood', price: 350 },
        { name: 'Lipid Profile', category: 'Blood', price: 600 },
      ],
      collectionType: 'home',
      collectionDate: '2024-12-26',
      collectionTime: '8:00 AM',
      address: { street: '123 Main St', city: 'Delhi', pincode: '110001' },
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Book Lab Test', res.data)
  } catch (e) {
    err('Book Lab Test', e)
  }
}

// ── 17. Logout ────────────────────────────────────────────────────────────────
const testLogout = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    log('Logout', res.data)
    accessToken = ''
  } catch (e) {
    err('Logout', e)
  }
}

// ── Run All ───────────────────────────────────────────────────────────────────
const runTests = async () => {
  console.log('╔════════════════════════════════╗')
  console.log('║   🚀 MC360 API Test Runner     ║')
  console.log('╚════════════════════════════════╝')

  await testWhatsApp()       // Test WhatsApp service
  await testHealth()         // Is server running?
  await testRegister()       // Create test account
  await testLogin()          // Login + get token
  await testGetMe()          // Verify token works
  await testGetProfile()     // Patient profile
  await testGetDoctors()     // List doctors
  await testBookAppointment() // Book appointment
  await testGetAppointments() // List appointments
  await testAddMedicine()    // Add medicine
  await testDrugInteraction() // AI drug check
  await testSymptomChecker() // AI symptoms
  await testAddMetric()      // Health metric
  await testDietPlan()       // AI diet plan
  await testGetNotifications() // Notifications
  await testBookTest()       // Book lab test
  await testLogout()         // Logout

  console.log('\n╔════════════════════════════════╗')
  console.log('║   ✅ All Tests Complete        ║')
  console.log('╚════════════════════════════════╝')
}

runTests()