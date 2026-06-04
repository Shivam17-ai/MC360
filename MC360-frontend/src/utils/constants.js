export const APP_NAME = 'MC360'
export const APP_VERSION = '1.0.0'

export const ROLES = {
  PATIENT:  'patient',
  DOCTOR:   'doctor',
  HOSPITAL: 'hospital',
  ADMIN:    'admin',
}

export const APPOINTMENT_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const REPORT_TYPES = {
  BLOOD_TEST:  'blood_test',
  XRAY:        'xray',
  MRI:         'mri',
  CT_SCAN:     'ct_scan',
  ULTRASOUND:  'ultrasound',
  ECG:         'ecg',
  OTHER:       'other',
}

export const MEDICINE_FREQUENCY = {
  ONCE_DAILY:   'Once Daily',
  TWICE_DAILY:  'Twice Daily',
  THRICE_DAILY: 'Thrice Daily',
  WEEKLY:       'Weekly',
  AS_NEEDED:    'As Needed',
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedist',
  'Pediatrician',
  'Psychiatrist',
  'Gynecologist',
  'Oncologist',
  'Radiologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Urologist',
  'Endocrinologist',
  'Pulmonologist',
]

export const GENDER = {
  MALE:   'male',
  FEMALE: 'female',
  OTHER:  'other',
}

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
}

export const TOKEN_KEY    = 'mc360_token'
export const USER_KEY     = 'mc360_user'
export const THEME_KEY    = 'mc360_theme'