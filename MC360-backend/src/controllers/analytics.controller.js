const Appointment = require("../models/Appointment.model");
const Patient = require("../models/Patient.model");
const Doctor = require("../models/Doctor.model");
const HealthMetric = require("../models/HealthMetric.model");
const Medicine = require("../models/Medicine.model");
const Hospital = require("../models/Hospital.model");
const User = require("../models/User.model");
const { successResponse, errorResponse } = require("../utils/response");

const getPatientAnalytics = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalAppointments, completedAppointments, activeMedicines, recentMetrics, adherenceData] = await Promise.all([
      Appointment.countDocuments({ patient: patient._id }),
      Appointment.countDocuments({ patient: patient._id, status: "completed" }),
      Medicine.countDocuments({ patient: patient._id, isActive: true }),
      HealthMetric.find({ patient: patient._id, recordedAt: { $gte: thirtyDaysAgo } }).sort({ recordedAt: -1 }),
      Medicine.find({ patient: patient._id, isActive: true }).select("name adherencePercentage"),
    ]);

    const overallAdherence = adherenceData.length ? Math.round(adherenceData.reduce((s, m) => s + m.adherencePercentage, 0) / adherenceData.length) : 0;

    // Group metrics by type for charting
    const metricsByType = recentMetrics.reduce((acc, m) => {
      if (!acc[m.type]) acc[m.type] = [];
      acc[m.type].push({ value: m.value, recordedAt: m.recordedAt });
      return acc;
    }, {});

    return successResponse(res, { totalAppointments, completedAppointments, activeMedicines, overallAdherence, metricsByType, recentMetricsCount: recentMetrics.length });
  } catch (err) { next(err); }
};

const getDoctorAnalytics = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [total, thisMonth, lastMonth, byStatus, recentRatings] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id }),
      Appointment.countDocuments({ doctor: doctor._id, date: { $gte: startOfMonth } }),
      Appointment.countDocuments({ doctor: doctor._id, date: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Appointment.aggregate([{ $match: { doctor: doctor._id } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Appointment.find({ doctor: doctor._id, rating: { $exists: true } }).select("rating review date").sort({ date: -1 }).limit(10),
    ]);

    return successResponse(res, { total, thisMonth, lastMonth, byStatus, recentRatings, averageRating: doctor.averageRating, totalPatients: doctor.totalPatients });
  } catch (err) { next(err); }
};

const getHospitalAnalytics = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital not found.", 404);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalDoctors, totalPatients, totalAppointments, monthAppointments, byType, byStatus] = await Promise.all([
      Doctor.countDocuments({ hospital: hospital._id }),
      Patient.countDocuments({ hospital: hospital._id }),
      Appointment.countDocuments({ hospital: hospital._id }),
      Appointment.countDocuments({ hospital: hospital._id, date: { $gte: startOfMonth } }),
      Appointment.aggregate([{ $match: { hospital: hospital._id } }, { $group: { _id: "$type", count: { $sum: 1 } } }]),
      Appointment.aggregate([{ $match: { hospital: hospital._id } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    // Monthly trend (last 6 months)
    const monthlyTrend = await Appointment.aggregate([
      { $match: { hospital: hospital._id, date: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return successResponse(res, { totalDoctors, totalPatients, totalAppointments, monthAppointments, byType, byStatus, monthlyTrend, availableBeds: hospital.availableBeds, totalBeds: hospital.totalBeds });
  } catch (err) { next(err); }
};

const getAdminAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalPatients, totalDoctors, totalHospitals, totalAppointments, usersByRole] = await Promise.all([
      User.countDocuments(),
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Hospital.countDocuments(),
      Appointment.countDocuments(),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    ]);
    return successResponse(res, { totalUsers, totalPatients, totalDoctors, totalHospitals, totalAppointments, usersByRole });
  } catch (err) { next(err); }
};

module.exports = { getPatientAnalytics, getDoctorAnalytics, getHospitalAnalytics, getAdminAnalytics };