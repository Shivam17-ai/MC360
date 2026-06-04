import api from "./api";

const reportService = {
  // Patient
  uploadReport: (formData) =>
    api.post("/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getMyReports: (params) => api.get("/reports/my", { params }),

  getReportById: (id) => api.get(`/reports/${id}`),

  deleteReport: (id) => api.delete(`/reports/${id}`),

  downloadReport: (id) =>
    api.get(`/reports/${id}/download`, { responseType: "blob" }),

  // Doctor
  getPatientReports: (patientId, params) =>
    api.get(`/reports/patient/${patientId}`, { params }),

  // Hospital
  getAllReports: (params) => api.get("/reports", { params }),
};

export default reportService;