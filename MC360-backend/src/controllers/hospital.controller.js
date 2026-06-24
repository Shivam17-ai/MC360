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

const getHospitalDoctors = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital profile not found.", 404);

    const filter = {
      $or: [
        { hospital: hospital._id },
        { _id: { $in: hospital.doctors } }
      ]
    };

    if (req.query.search) {
      const users = await User.find({
        role: "doctor",
        name: { $regex: req.query.search, $options: "i" }
      }).select("_id");
      filter.user = { $in: users.map(u => u._id) };
    }

    const doctors = await Doctor.find(filter)
      .populate("user", "name email phone avatar isActive");

    const formatted = doctors.map(doc => ({
      _id: doc._id,
      name: doc.user?.name || "Unknown",
      email: doc.user?.email,
      phone: doc.user?.phone,
      avatar: doc.user?.avatar,
      specialization: doc.specialization,
      experience: doc.experience,
      isActive: doc.user?.isActive !== false
    }));

    return successResponse(res, formatted);
  } catch (err) { next(err); }
};

const createAndAddDoctor = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital profile not found.", 404);

    const { name, email, phone, specialization, experience } = req.body;
    if (!name || !email || !specialization) {
      return errorResponse(res, "Name, email, and specialization are required.", 400);
    }

    // Check if user exists
    let user = await User.findOne({ email });
    let doctor;

    if (user) {
      if (user.role !== "doctor") {
        return errorResponse(res, `User is already registered as a ${user.role}.`, 400);
      }
      doctor = await Doctor.findOne({ user: user._id });
      if (doctor && doctor.hospital) {
        if (doctor.hospital.toString() === hospital._id.toString()) {
          return errorResponse(res, "Doctor is already added to this hospital.", 400);
        } else {
          return errorResponse(res, "Doctor is already associated with another hospital.", 400);
        }
      }
    } else {
      // Create user
      const tempPassword = Math.random().toString(36).slice(-10);
      user = await User.create({
        name,
        email,
        phone,
        password: tempPassword,
        role: "doctor",
        isVerified: true
      });
    }

    if (!doctor) {
      doctor = await Doctor.create({
        user: user._id,
        hospital: hospital._id,
        specialization,
        experience: Number(experience) || 0,
        availability: [
          { day: "Monday", slots: [], isAvailable: true },
          { day: "Tuesday", slots: [], isAvailable: true },
          { day: "Wednesday", slots: [], isAvailable: true },
          { day: "Thursday", slots: [], isAvailable: true },
          { day: "Friday", slots: [], isAvailable: true }
        ]
      });
    } else {
      doctor.hospital = hospital._id;
      if (experience) doctor.experience = Number(experience);
      doctor.specialization = specialization;
      await doctor.save();
    }

    if (!hospital.doctors.includes(doctor._id)) {
      hospital.doctors.push(doctor._id);
      await hospital.save();
    }

    return successResponse(res, {
      _id: doctor._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      specialization: doctor.specialization,
      experience: doctor.experience,
      isActive: user.isActive !== false
    }, "Doctor created and added successfully.", 201);
  } catch (err) { next(err); }
};

const removeHospitalDoctor = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital profile not found.", 404);

    const doctorId = req.params.id;
    hospital.doctors = hospital.doctors.filter(d => d.toString() !== doctorId);
    await hospital.save();

    await Doctor.findByIdAndUpdate(doctorId, { hospital: null });

    return successResponse(res, {}, "Doctor removed successfully.");
  } catch (err) { next(err); }
};

const getHospitalPatients = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital profile not found.", 404);

    const filter = { hospital: hospital._id };

    if (req.query.search) {
      const users = await User.find({
        role: "patient",
        name: { $regex: req.query.search, $options: "i" }
      }).select("_id");
      filter.user = { $in: users.map(u => u._id) };
    }

    const patients = await Patient.find(filter)
      .populate("user", "name email phone avatar createdAt");

    const formatted = await Promise.all(patients.map(async pat => {
      const apptCount = await Appointment.countDocuments({ hospital: hospital._id, patient: pat._id });
      return {
        _id: pat._id,
        name: pat.user?.name || "Unknown",
        email: pat.user?.email,
        phone: pat.user?.phone,
        bloodGroup: pat.bloodGroup,
        createdAt: pat.user?.createdAt || pat.createdAt,
        appointmentCount: apptCount,
        isActive: true
      };
    }));

    return successResponse(res, formatted);
  } catch (err) { next(err); }
};

const getHospitalAnalyticsPage = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) return errorResponse(res, "Hospital profile not found.", 404);

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 1. Monthly appointments (last 6 months)
    const appointmentsTrend = await Appointment.aggregate([
      {
        $match: {
          hospital: hospital._id,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyAppointments = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const mLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      
      const found = appointmentsTrend.find(a => a._id.year === year && a._id.month === monthNum);
      monthlyAppointments.push({
        month: mLabel,
        count: found ? found.count : 0
      });
    }

    // 2. Patients by Specialization
    const doctorsList = await Doctor.find({ hospital: hospital._id }).select("specialization");
    const docIds = doctorsList.map(d => d._id);
    const specMap = {};
    doctorsList.forEach(d => {
      if (d.specialization) {
        specMap[d.specialization] = 0;
      }
    });

    const appointmentsForSpec = await Appointment.find({
      hospital: hospital._id,
      doctor: { $in: docIds }
    }).populate("doctor", "specialization");

    appointmentsForSpec.forEach(appt => {
      if (appt.doctor && appt.doctor.specialization) {
        const spec = appt.doctor.specialization;
        specMap[spec] = (specMap[spec] || 0) + 1;
      }
    });

    const bySpecialization = Object.keys(specMap).map(name => ({
      name,
      value: specMap[name]
    })).filter(item => item.value > 0);

    if (bySpecialization.length === 0) {
      bySpecialization.push({ name: "General Medicine", value: 0 });
    }

    // 3. Revenue Trend
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          hospital: hospital._id,
          status: "completed",
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          revenue: { $sum: "$fee" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const revenue = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const mLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      
      const found = revenueData.find(r => r._id.year === year && r._id.month === monthNum);
      revenue.push({
        month: mLabel,
        revenue: found ? found.revenue : 0
      });
    }

    // 4. Key metrics
    const [totalCompleted, totalCancelled, totalNoShow] = await Promise.all([
      Appointment.countDocuments({ hospital: hospital._id, status: "completed" }),
      Appointment.countDocuments({ hospital: hospital._id, status: "cancelled" }),
      Appointment.countDocuments({ hospital: hospital._id, status: "no-show" })
    ]);

    const ratings = await Appointment.find({ hospital: hospital._id, rating: { $exists: true } }).select("rating");
    const satisfaction = ratings.length > 0 
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length * 5)) * 100)
      : 95;

    const denominator = totalCompleted + totalCancelled + totalNoShow;
    const completionRate = denominator > 0 
      ? Math.round((totalCompleted / denominator) * 100)
      : 100;

    const doctorUtilization = docIds.length > 0 ? 80 : 0;
    const bedOccupancy = hospital.totalBeds > 0 
      ? Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100)
      : 0;

    return successResponse(res, {
      monthlyAppointments,
      bySpecialization,
      revenue,
      satisfaction,
      completionRate,
      doctorUtilization,
      bedOccupancy
    });
  } catch (err) { next(err); }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllHospitals,
  getHospitalById,
  addDoctor,
  removeDoctor,
  getHospitalStats,
  getHospitalDoctors,
  createAndAddDoctor,
  removeHospitalDoctor,
  getHospitalPatients,
  getHospitalAnalyticsPage
};