
import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Clock, Phone, MapPin, RefreshCw, User } from "lucide-react";
import api from "../../services/api";
import useSocketStore from "../../store/socketStore";
import Badge from "../../components/common/Badge";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import Toast from "../../components/common/Toast";

const severityConfig = {
  critical: { label: "Critical", className: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500 animate-pulse" },
  high: { label: "High", className: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  low: { label: "Low", className: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
};

const statusConfig = {
  active: { label: "Active", variant: "danger" },
  responding: { label: "Responding", variant: "warning" },
  resolved: { label: "Resolved", variant: "success" },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const EmergencyMonitor = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [toast, setToast] = useState(null);
  const { socket } = useSocketStore();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/emergency/alerts", { params: { status: filter } });
      setAlerts(res.alerts || res || []);
    } catch (err) {
      showToast(err.message || "Failed to fetch alerts.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  // Real-time socket
  useEffect(() => {
    if (!socket) return;
    socket.on("emergency-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      showToast(`🚨 New emergency: ${alert.description}`, "error");
    });
    socket.on("emergency-updated", (updated) => {
      setAlerts((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    });
    return () => {
      socket.off("emergency-alert");
      socket.off("emergency-updated");
    };
  }, [socket]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleResolve = async (id) => {
    try {
      await api.patch(`/emergency/alerts/${id}/resolve`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "resolved" } : a))
      );
      showToast("Emergency marked as resolved.");
    } catch (err) {
      showToast(err.message || "Failed to resolve.", "error");
    }
  };

  const handleRespond = async (id) => {
    try {
      await api.patch(`/emergency/alerts/${id}/respond`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "responding" } : a))
      );
      showToast("Response initiated.");
    } catch (err) {
      showToast(err.message || "Failed to update status.", "error");
    }
  };

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Emergency Monitor</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeCount > 0 ? (
                <span className="text-red-600 font-medium">{activeCount} active alert{activeCount !== 1 ? "s" : ""}</span>
              ) : (
                "No active emergencies"
              )}
            </p>
          </div>
        </div>
        <button
          onClick={fetchAlerts}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {["active", "responding", "resolved", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No {filter !== "all" ? filter : ""} emergencies</p>
          <p className="text-sm text-gray-400 mt-1">All clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const sev = severityConfig[alert.severity] || severityConfig.medium;
            const sta = statusConfig[alert.status] || statusConfig.active;

            return (
              <div
                key={alert._id}
                className={`bg-white rounded-2xl border p-5 shadow-sm ${sev.className}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left */}
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${sev.dot}`} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{alert.type || "Emergency Alert"}</span>
                        <Badge variant={sta.variant}>{sta.label}</Badge>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sev.className}`}>
                          {sev.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        {alert.patient?.name && (
                          <span className="flex items-center gap-1">
                            <User size={11} /> {alert.patient.name}
                          </span>
                        )}
                        {alert.patient?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={11} /> {alert.patient.phone}
                          </span>
                        )}
                        {alert.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {alert.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {timeAgo(alert.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {alert.status === "active" && (
                      <button
                        onClick={() => handleRespond(alert._id)}
                        className="text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Respond
                      </button>
                    )}
                    {alert.status !== "resolved" && (
                      <button
                        onClick={() => handleResolve(alert._id)}
                        className="text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default EmergencyMonitor;