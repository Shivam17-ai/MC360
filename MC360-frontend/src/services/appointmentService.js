import api from './api'

export const appointmentService = {
  getAll:        (params) => api.get('/appointments', { params }),
  getById:       (id) => api.get(`/appointments/${id}`),
  create:        (data) => api.post('/appointments', data),
  updateStatus:  (id, data) => api.put(`/appointments/${id}/status`, data),
  cancel:        (id, data) => api.post(`/appointments/${id}/cancel`, data),
  bookFollowUp:  (id, data) => api.post(`/appointments/${id}/book-followup`, data),
  getSlots:      (doctorId, date) => api.get(`/appointments/doctor/${doctorId}/availability`, { params: { date } }),
  getDoctors:    (params) => api.get('/doctors', { params }),
}