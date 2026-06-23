export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  HOSPITAL: 'hospital',
}

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
}

export const REPORT_TYPES = [
  'Blood Test',
  'X-Ray',
  'MRI',
  'CT Scan',
  'ECG',
  'Ultrasound',
  'Urine Test',
  'Other',
]

export const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Neurologist',
  'Orthopedist',
  'Dermatologist',
  'Gynecologist',
  'Pediatrician',
  'Psychiatrist',
  'Ophthalmologist',
  'ENT Specialist',
  'Endocrinologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Nephrologist',
  'Oncologist',
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const FREQUENCY_OPTIONS = [
  { value: 'once-daily', label: 'Once daily' },
  { value: 'twice-daily', label: 'Twice daily' },
  { value: 'thrice-daily', label: 'Three times a day' },
  { value: 'four-times-daily', label: 'Four times a day' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as-needed', label: 'As needed' },
  { value: 'custom', label: 'Custom' },
]

export const QUEUE_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  SKIPPED: 'skipped',
}