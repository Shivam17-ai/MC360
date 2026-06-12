import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['patient', 'doctor', 'hospital']),
})

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Select a doctor'),
  date: z.string().min(1, 'Select a date'),
  slot: z.string().min(1, 'Select a time slot'),
  reason: z.string().min(5, 'Describe your reason briefly'),
})

export const medicineSchema = z.object({
  name: z.string().min(2, 'Medicine name required'),
  dosage: z.string().min(1, 'Dosage required'),
  frequency: z.string().min(1, 'Frequency required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  notes: z.string().optional(),
})

export const healthMetricSchema = z.object({
  type: z.enum(['weight', 'blood_pressure', 'glucose', 'heart_rate', 'oxygen']),
  value: z.string().min(1, 'Value required'),
  unit: z.string().min(1, 'Unit required'),
  recordedAt: z.string().optional(),
})