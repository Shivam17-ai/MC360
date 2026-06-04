export default function ManagePatients() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-bold text-slate-800">ManagePatients</h1>
      <p className="text-slate-500 mt-1">Coming soon.</p>
    </div>
  )
}
import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Users, Phone, Mail, CalendarDays } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 400);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hospital/patients", {
        params: { search: debouncedSearch, page, limit: 10 },
      });
      setPatients(res.patients || res || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast(err.message || "Failed to load patients.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch, page]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/hospital/patients/${deleteId}`);
      setPatients((prev) => prev.filter((p) => p._id !== deleteId));
      showToast("Patient removed successfully.");
    } catch (err) {
      showToast(err.message || "Failed to delete patient.", "error");
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
          <h1 className="text-2xl font-bold text-gray-800">Manage Patients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} registered
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full max-w-sm shadow-sm">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : patients.length === 0 ? (
          <EmptyState
            icon={<Users size={36} />}
            title="No patients found"
            description="Patients registered on the platform will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Patient", "Contact", "DOB / Gender", "Appointments", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm shrink-0">
                          {patient.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.name}</p>
                          <p className="text-xs text-gray-400">ID: {patient._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail size={11} /> {patient.email || "—"}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone size={11} /> {patient.phone || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <div>
                        <p className="text-xs">
                          {patient.dob
                            ? new Date(patient.dob).toLocaleDateString()
                            : "—"}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{patient.gender || "—"}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <div className="flex items-center gap-1 text-xs">
                        <CalendarDays size={12} className="text-blue-500" />
                        {patient.totalAppointments ?? "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={patient.isActive !== false ? "success" : "danger"}>
                        {patient.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/hospital/patients/${patient._id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(patient._id)}
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
        title="Remove Patient"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Remove</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to remove this patient? All associated records will be deleted.
        </p>
      </Modal>
    </div>
  );
};

export default ManagePatients;