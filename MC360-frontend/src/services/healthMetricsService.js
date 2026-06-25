import api from './api'

export const healthMetricsService = {
  getAll: (type, limit = 50) => api.get('/health-metrics', { params: { type, limit } }),
  add: (data) => api.post('/health-metrics', data),
  addBulk: (data) => api.post('/health-metrics/bulk', data),
  delete: (id) => api.delete(`/health-metrics/${id}`),
  getTrends: (type, period) => api.get('/health-metrics/trends', { params: { type, period } }),
}