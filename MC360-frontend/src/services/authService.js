import api from './api'

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  googleLogin: (token) => api.post('/auth/google', { token }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  getDoctorProfile: () => api.get('/doctors/me'),
  updateDoctorProfile: (data) => api.put('/doctors/me', data),
  getPatientProfile: () => api.get('/patients/me'),
  updatePatientProfile: (data) => api.put('/patients/me', data),
}