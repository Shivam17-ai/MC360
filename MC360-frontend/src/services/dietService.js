import api from './api'

export const dietService = {
  generate: (data) => api.post('/diet/generate', data),
  getPlans: () => api.get('/diet/history'),
  getActivePlan: () => api.get('/diet/active'),
  getPlanById: (id) => api.get(`/diet/${id}`),
}