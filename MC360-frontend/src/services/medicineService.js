import api from './api'

export const medicineService = {
  getAll: () => api.get('/medicines'),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
  logAdherence: (id, data) => api.post(`/medicines/${id}/adherence`, data),
  checkInteraction: (drugs) => api.post('/medicines/check-interactions', { drugs }),
}