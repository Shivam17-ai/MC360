import { useState, useEffect, useCallback } from "react";
import healthMetricsService from "../services/healthMetricsService";

/**
 * useHealthMetrics
 * Fetches and manages patient health metrics (BP, glucose, weight, etc.)
 *
 * Usage:
 *   const { metrics, loading, error, addMetric, refetch } = useHealthMetrics("bloodPressure");
 */
const useHealthMetrics = (type = "all", patientId = null) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        type === "all"
          ? await healthMetricsService.getAllMetrics(patientId)
          : await healthMetricsService.getMetricsByType(type, patientId);
      setMetrics(data);
    } catch (err) {
      setError(err.message || "Failed to fetch health metrics.");
    } finally {
      setLoading(false);
    }
  }, [type, patientId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const addMetric = async (payload) => {
    try {
      const created = await healthMetricsService.addMetric(payload);
      setMetrics((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.message || "Failed to add metric.");
      throw err;
    }
  };

  const deleteMetric = async (id) => {
    try {
      await healthMetricsService.deleteMetric(id);
      setMetrics((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete metric.");
      throw err;
    }
  };

  return { metrics, loading, error, addMetric, deleteMetric, refetch: fetchMetrics };
};

export default useHealthMetrics;