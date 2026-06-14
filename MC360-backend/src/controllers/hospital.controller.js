const Hospital = require("../models/Hospital.model");
const Doctor = require("../models/Doctor.model");
const Patient = require("../models/Patient.model");
const Appointment = require("../models/Appointment.model");
const EmergencyAlert = require("../models/EmergencyAlert.model");
const QueueToken = require("../models/QueueToken.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");
const { uploadToCloudinary, deleteFromCloudinary } = require("../middlewares/upload.middleware");

const getMyProfile = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id }).populate("user", "-password -refreshToken").populate("doctors");
    if (!hospital) return errorResponse(res, "Hospital profile not found.", 404);
    return successResponse(res, { hospital });
  } catch (err) { next(err); }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "type", "address", "phone", "email", "website", "facilities", "specializations", "totalBeds", "availableBeds", "emergencyAvailable", "emergencyPhone", "ambulanceAvailable", "icuAvailable", "bloodBank", "pharmacy", "diagnosticsLab", "operatingHours"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.file) {
      const hospital = await Hospital.findOne({ user: req.user._id });
      if (hospital?.logoPublicId) await deleteFromCloudinary(hospital.logoPublicId).catch(() => { });
      const result = await uploadToCloudinary(req.file.buffer, "mc360/hospitals", "image");
      updates.logo = result.secure_url;
      updates.logoPublicId = result.public_id;
    }

    const hospital = await Hospital.findOneAndUpdate({ user: req.user._id }, updates, { new: true, runValidators: true });
    return successResponse(res, { hospital }, "Profile updated.");
  } catch (err) { next(err); }
};

const getAllHospitals = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.city) filter["address.city"] = { $regex: req.query.city, $options: "i" };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.emergency === "true") filter.emergencyAvailable = true;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };

    const { data, pagination } = await paginate(Hospital, filter, {
      page: req.query.page,
      limit: req.query.limit,
      populate: { path: "user", select: "name email phone" },
      sort: { averageRating: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate("user", "-password").populate({ path: "doctors", populate: { path: "user", select: "name avatar" } });
    if (!hospital) return errorResponse(res, "Hospital not found.", 404);
    return successResponse(res, { hospital });
  } catch (err) { next(err); }
};

const addDoctor = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital not found.", 404);
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    doctor.hospital = hospital._id;
    await doctor.save();
    if (!hospital.doctors.includes(doctor._id)) {
      hospital.doctors.push(doctor._id);
      await hospital.save();
    }
    return successResponse(res, {}, "Doctor added to hospital.");
  } catch (err) { next(err); }
};

const removeDoctor = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital not found.", 404);

    hospital.doctors = hospital.doctors.filter((d) => d.toString() !== req.params.doctorId);
    await hospital.save();
    await Doctor.findByIdAndUpdate(req.params.doctorId, { hospital: null });
    return successResponse(res, {}, "Doctor removed.");
  } catch (err) { next(err); }
};

const getHospitalStats = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital not found.", 404);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [totalDoctors, totalPatients, todayAppointments, emergencyAlerts, appointments, newPatientsWeek, tokensToday] = await Promise.all([
      Doctor.countDocuments({ $or: [{ hospital: hospital._id }, { _id: { $in: hospital.doctors } }] }),
      Patient.countDocuments({ hospital: hospital._id }),
      Appointment.countDocuments({ hospital: hospital._id, date: { $gte: today, $lte: endOfToday } }),
      EmergencyAlert.countDocuments({ hospitalNotified: hospital._id, status: { $ne: "resolved" } }),
      Appointment.find({ hospital: hospital._id, date: { $gte: thirtyDaysAgo } }).select("date"),
      Patient.countDocuments({ hospital: hospital._id, createdAt: { $gte: oneWeekAgo } }),
      QueueToken.find({ hospital: hospital._id, date: { $gte: today }, calledAt: { $exists: true, $ne: null } }).select("date calledAt")
    ]);

    // Trend calculation (30 days)
    const trendsMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      trendsMap[d.toISOString().split('T')[0]] = 0;
    }
    appointments.forEach(a => {
      if (a.date) {
        const dStr = a.date.toISOString().split('T')[0];
        if (trendsMap[dStr] !== undefined) trendsMap[dStr]++;
      }
    });
    const visitTrends = Object.keys(trendsMap).sort().map(date => ({
      date: date.split('-').slice(1).join('/'),
      visits: trendsMap[date]
    }));

    // Average wait time calculation from today's tokens
    let avgWaitTime = 0;
    if (tokensToday.length > 0) {
      const totalWait = tokensToday.reduce((sum, t) => {
        const waitMs = t.calledAt.getTime() - t.date.getTime();
        return sum + Math.max(0, waitMs);
      }, 0);
      avgWaitTime = Math.round((totalWait / tokensToday.length) / 60000); // in minutes
    }

    // Dynamic Department breakdown (based on actual appointments with doctors of each specialization)
    const doctorsList = await Doctor.find({ hospital: hospital._id }).select("specialization");
    const deptMap = {};
    const doctorToDept = {};
    doctorsList.forEach(d => {
      if (d.specialization) {
        deptMap[d.specialization] = 0;
        doctorToDept[d._id.toString()] = d.specialization;
      }
    });

    const appointmentsList = await Appointment.find({
      hospital: hospital._id,
      doctor: { $in: doctorsList.map(d => d._id) }
    }).select("doctor");

    appointmentsList.forEach(a => {
      if (a.doctor) {
        const dept = doctorToDept[a.doctor.toString()];
        if (dept !== undefined) {
          deptMap[dept]++;
        }
      }
    });

    const totalDeptAppointments = Object.values(deptMap).reduce((a, b) => a + b, 0);

    const departments = Object.keys(deptMap).map(name => {
      const count = deptMap[name];
      const percent = totalDeptAppointments > 0 ? Math.round((count / totalDeptAppointments) * 100) : 0;
      return {
        name,
        count,
        percent
      };
    });

    return successResponse(res, {
      totalDoctors,
      totalPatients,
      todayAppointments,
      emergencyAlerts,
      visitTrends,
      departments,
      availableBeds: hospital.availableBeds,
      totalBeds: hospital.totalBeds,
      bedOccupancy: Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100) || 0,
      avgWaitTime,
      newPatientsWeek
    });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, updateMyProfile, getAllHospitals, getHospitalById, addDoctor, removeDoctor, getHospitalStats };