export default function HospitalDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-bold text-slate-800">HospitalDashboard</h1>
      <p className="text-slate-500 mt-1">Coming soon.</p>
    </div>
  )
}

import { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  CalendarDays,
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-green-600 font-medium mt-1">{sub}</p>}
    </div>
  </div>
);

const HospitalDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsData, apptData] = await Promise.all([
          api.get("/hospital/stats"),
          api.get("/appointments/hospital?limit=5&sort=createdAt"),
        ]);
        setStats(statsData);
        setRecentAppointments(apptData?.appointments || apptData || []);
      } catch (err) {
        console.error("Hospital dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="space-y-6">
        <SkeletonLoader className="h-8 w-56" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <SkeletonLoader className="h-64 rounded-2xl" />
      </div>
    );

  const statCards = [
    { label: "Total Doctors", value: stats?.totalDoctors, icon: Stethoscope, color: "bg-blue-100 text-blue-600" },
    { label: "Total Patients", value: stats?.totalPatients, icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Today's Appointments", value: stats?.todayAppointments, icon: CalendarDays, color: "bg-green-100 text-green-600", sub: `${stats?.completedToday || 0} completed` },
    { label: "Active Emergencies", value: stats?.activeEmergencies ?? 0, icon: AlertTriangle, color: "bg-red-100 text-red-600" },
  ];

  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hospital Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of hospital operations · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Appointments</h2>
            <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all</span>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No recent appointments.</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((appt) => {
                const cfg = statusConfig[appt.status] || statusConfig.pending;
                return (
                  <div key={appt._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        {appt.patient?.name?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{appt.patient?.name || "Patient"}</p>
                        <p className="text-xs text-gray-400">Dr. {appt.doctor?.name || "—"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.className}`}>
                        {cfg.label}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {appt.date ? new Date(appt.date).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: "Avg. Wait Time", value: stats?.avgWaitTime ? `${stats.avgWaitTime} min` : "—", icon: Clock, color: "text-blue-600" },
              { label: "Bed Occupancy", value: stats?.bedOccupancy ? `${stats.bedOccupancy}%` : "—", icon: Activity, color: "text-purple-600" },
              { label: "Satisfaction Rate", value: stats?.satisfactionRate ? `${stats.satisfactionRate}%` : "—", icon: TrendingUp, color: "text-green-600" },
              { label: "Resolved Today", value: stats?.resolvedToday ?? "—", icon: CheckCircle2, color: "text-emerald-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon size={15} className={color} />
                  {label}
                </div>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;