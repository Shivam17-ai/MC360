import api from './api';

export const testService = {
  getAll: (params) => api.get('/tests', { params }),
  getById: (id) => api.get(`/tests/${id}`),
  book: (data) => api.post('/tests/book', data),
  cancel: (id) => api.put(`/tests/${id}/cancel`),
};
