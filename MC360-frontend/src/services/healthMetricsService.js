import api from './api'

export const healthMetricsService = {
  getAll: (type) => api.get('/health-metrics', { params: { type } }),
  add: (data) => api.post('/health-metrics', data),
  addBulk: (data) => api.post('/health-metrics/bulk', data),
  delete: (id) => api.delete(`/health-metrics/${id}`),
  getTrends: (type, period) => api.get('/health-metrics/trends', { params: { type, period } }),
}