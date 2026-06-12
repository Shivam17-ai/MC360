import api from './api'

export const reportService = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  upload: (formData) =>
    api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/reports/${id}`),
  summarize: (id) => api.post(`/reports/${id}/summarize`),
}