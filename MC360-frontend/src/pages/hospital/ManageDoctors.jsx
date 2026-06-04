export default function ManageDoctors() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-bold text-slate-800">ManageDoctors</h1>
      <p className="text-slate-500 mt-1">Coming soon.</p>
    </div>
  )
}
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, Phone, Mail } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import useDebounce from "../../hooks/useDebounce";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hospital/doctors", {
        params: { search: debouncedSearch, page, limit: 10 },
      });
      setDoctors(res.doctors || res || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast(err.message || "Failed to load doctors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [debouncedSearch, page]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = async (doctor) => {
    try {
      const updated = await api.patch(`/hospital/doctors/${doctor._id}/toggle-status`);
      setDoctors((prev) =>
        prev.map((d) => (d._id === doctor._id ? { ...d, isActive: updated.isActive } : d))
      );
      showToast(`Dr. ${doctor.name} ${updated.isActive ? "activated" : "deactivated"}.`);
    } catch (err) {
      showToast(err.message || "Failed to update status.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/hospital/doctors/${deleteId}`);
      setDoctors((prev) => prev.filter((d) => d._id !== deleteId));
      showToast("Doctor removed successfully.");
    } catch (err) {
      showToast(err.message || "Failed to delete doctor.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button
          onClick={() => window.location.href = "/hospital/doctors/add"}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Doctor
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full max-w-sm shadow-sm">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={<UserCheck size={36} />}
            title="No doctors found"
            description="Add doctors to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Doctor", "Specialization", "Contact", "Patients", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                          {doctor.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Dr. {doctor.name}</p>
                          <p className="text-xs text-gray-400">{doctor.qualification || "MBBS"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{doctor.specialization || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail size={11} /> {doctor.email || "—"}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone size={11} /> {doctor.phone || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{doctor.totalPatients ?? "—"}</td>
                    <td className="px-5 py-4">
                      <Badge variant={doctor.isActive ? "success" : "danger"}>
                        {doctor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(doctor)}
                          title={doctor.isActive ? "Deactivate" : "Activate"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            doctor.isActive
                              ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                              : "text-green-400 hover:bg-green-50 hover:text-green-600"
                          }`}
                        >
                          {doctor.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button
                          onClick={() => window.location.href = `/hospital/doctors/edit/${doctor._id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(doctor._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Confirm delete modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Doctor"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Remove</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to remove this doctor? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ManageDoctors;