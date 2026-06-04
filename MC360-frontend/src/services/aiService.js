import api from "./api";

const aiService = {
  // Symptom checker / triage
  checkSymptoms: (symptoms) => api.post("/ai/symptom-check", { symptoms }),

  // Risk prediction
  predictRisk: (formData) => api.post("/ai/risk-predict", formData),

  // OCR report scanning
  scanReport: (formData) =>
    api.post("/ai/ocr-scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Report summarizer
  summarizeReport: (reportId) => api.post(`/ai/summarize/${reportId}`),

  // Drug interaction checker
  checkDrugInteractions: (drugs) => api.post("/ai/drug-interactions", { drugs }),
};

export default aiService;