import api from "./api";

const healthMetricsService = {
  getAllMetrics: (patientId) =>
    api.get("/health-metrics", { params: patientId ? { patientId } : {} }),

  getMetricsByType: (type, patientId) =>
    api.get(`/health-metrics/${type}`, { params: patientId ? { patientId } : {} }),

  addMetric: (data) => api.post("/health-metrics", data),

  updateMetric: (id, data) => api.put(`/health-metrics/${id}`, data),

  deleteMetric: (id) => api.delete(`/health-metrics/${id}`),

  getMetricTrends: (type, range = "7d") =>
    api.get(`/health-metrics/trends/${type}`, { params: { range } }),

  // Specific helpers used by chart components
  getBloodPressure: (range) =>
    healthMetricsService.getMetricsByType("bloodPressure").then(
      (d) => d?.slice?.(-parseInt(range) || undefined) ?? d
    ),

  getGlucose: () => healthMetricsService.getMetricsByType("glucose"),

  getWeight: () => healthMetricsService.getMetricsByType("weight"),
};

export default healthMetricsService;