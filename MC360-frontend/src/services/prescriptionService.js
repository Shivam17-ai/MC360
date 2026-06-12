import api from './api'

export const prescriptionService = {
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  create: (data) => api.post('/prescriptions', data),
  getById: (id) => api.get(`/prescriptions/${id}`),
  download: (id) => api.get(`/prescriptions/${id}/download`, { responseType: 'blob' }),
}