export default function Analytics() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-bold text-slate-800">Analytics</h1>
      <p className="text-slate-500 mt-1">Coming soon.</p>
    </div>
  )
}
import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Users, CalendarDays, Star } from "lucide-react";
import api from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get("/hospital/analytics", { params: { range } });
        setData(res);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  if (loading)
    return (
      <div className="space-y-6">
        <SkeletonLoader className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );

  const appointmentTrend = data?.appointmentTrend || [];
  const deptDistribution = data?.deptDistribution || [];
  const patientGrowth = data?.patientGrowth || [];
  const topDoctors = data?.topDoctors || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Hospital performance overview</p>
        </div>
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === r ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Appointment trend + Patient growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Appointment Trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={appointmentTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Patient Growth">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patientGrowth} barSize={24} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Bar dataKey="patients" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Row 2: Department pie + Top doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Department Distribution">
          {deptDistribution.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={deptDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                >
                  {deptDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Top Doctors by Appointments">
          {topDoctors.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No data available.</p>
          ) : (
            <div className="space-y-3">
              {topDoctors.map((doc, i) => (
                <div key={doc._id || i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {doc.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700 truncate">Dr. {doc.name}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                        <Star size={11} fill="currentColor" />
                        {doc.rating?.toFixed(1) || "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min((doc.appointments / (topDoctors[0]?.appointments || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{doc.appointments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default Analytics;