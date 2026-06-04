import { useState, useEffect, useCallback } from "react";
import medicineService from "../services/medicineService";

/**
 * useMedicines
 * Fetches and manages patient medicines + adherence toggle.
 *
 * Usage:
 *   const { medicines, loading, error, addMedicine, updateMedicine, deleteMedicine, toggleTaken } = useMedicines();
 */
const useMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicineService.getMedicines();
      setMedicines(data);
    } catch (err) {
      setError(err.message || "Failed to fetch medicines.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const addMedicine = async (payload) => {
    try {
      const created = await medicineService.addMedicine(payload);
      setMedicines((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.message || "Failed to add medicine.");
      throw err;
    }
  };

  const updateMedicine = async (id, payload) => {
    try {
      const updated = await medicineService.updateMedicine(id, payload);
      setMedicines((prev) => prev.map((m) => (m._id === id ? updated : m)));
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update medicine.");
      throw err;
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await medicineService.deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete medicine.");
      throw err;
    }
  };

  const toggleTaken = async (id) => {
    try {
      const updated = await medicineService.toggleTaken(id);
      setMedicines((prev) => prev.map((m) => (m._id === id ? updated : m)));
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update adherence.");
      throw err;
    }
  };

  return {
    medicines,
    loading,
    error,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    toggleTaken,
    refetch: fetchMedicines,
  };
};

export default useMedicines;