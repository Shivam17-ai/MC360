import api from './api'

export const aiService = {
  checkSymptoms: (data) => api.post('/ai/analyze-symptoms', data),
  predictRisk: (data) => api.post('/ai/predict-risk', data),
  scanOCR: (formData) =>
    api.post('/ai/ocr-scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  summarizeReport: (reportId) => api.post(`/ai/summarize-report/${reportId}`),
  checkDrugInteractions: (data) => api.post('/ai/check-drug-interactions', data),
  generateDietPlan: (data) => api.post('/ai/generate-diet-plan', data),
  chat: (data) => api.post('/ai/chat', data),
}