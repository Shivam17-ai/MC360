const Doctor = require("../models/Doctor.model");
const User = require("../models/User.model");
const Patient = require("../models/Patient.model");
const Appointment = require("../models/Appointment.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const getMyProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate("user", "-password -refreshToken")
      .populate("hospital", "name address logo");
    if (!doctor) return errorResponse(res, "Doctor profile not found.", 404);
    return successResponse(res, { doctor });
  } catch (err) { next(err); }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const allowed = [
      "specialization", "subSpecialization", "qualifications", "experience",
      "biography", "languages", "consultationFee", "telemedicineAvailable",
      "telemedicineFee", "availability", "leaveDates",
    ];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id }, updates, { new: true, runValidators: true }
    ).populate("user", "-password");

    return successResponse(res, { doctor }, "Profile updated.");
  } catch (err) { next(err); }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.specialization) filter.specialization = { $regex: req.query.specialization, $options: "i" };
    if (req.query.hospital) filter.hospital = req.query.hospital;
    if (req.query.telemedicine === "true") filter.telemedicineAvailable = true;
    if (req.query.search) {
      const users = await User.find({
        role: "doctor",
        name: { $regex: req.query.search, $options: "i" },
      }).select("_id");
      filter.user = { $in: users.map((u) => u._id) };
    }

    const { data, pagination } = await paginate(Doctor, filter, {
      page: req.query.page,
      limit: req.query.limit,
      populate: [
        { path: "user", select: "name email phone avatar" },
        { path: "hospital", select: "name city" },
      ],
      sort: { averageRating: -1 },
    });

    // Flatten response for easier frontend consumption
    const flattened = data.map(doc => ({
      _id: doc._id,
      name: doc.user?.name || "Unknown",
      email: doc.user?.email,
      phone: doc.user?.phone,
      avatar: doc.user?.avatar,
      specialization: doc.specialization,
      experience: doc.experience,
      rating: doc.averageRating,
      totalRatings: doc.totalRatings,
      consultationFee: doc.consultationFee,
      telemedicineFee: doc.telemedicineFee,
      telemedicineAvailable: doc.telemedicineAvailable,
      hospital: doc.hospital,
      offersVideo: doc.telemedicineAvailable,
    }));

    return paginatedResponse(res, flattened, pagination);
  } catch (err) { next(err); }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "-password -refreshToken")
      .populate("hospital", "name address phone logo");
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);
    return successResponse(res, { doctor });
  } catch (err) { next(err); }
};

const rateDoctor = async (req, res, next) => {
  try {
    const { rating, review, appointmentId } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    // Update appointment rating
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { rating, review });
    }

    // Recalculate average rating
    const newTotal = doctor.totalRatings + 1;
    doctor.averageRating = parseFloat(
      ((doctor.averageRating * doctor.totalRatings + rating) / newTotal).toFixed(1)
    );
    doctor.totalRatings = newTotal;
    await doctor.save();

    return successResponse(res, { averageRating: doctor.averageRating }, "Rating submitted.");
  } catch (err) { next(err); }
};

const getDoctorStats = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [total, todayCount, pending, completed] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id }),
      Appointment.countDocuments({ doctor: doctor._id, date: { $gte: today } }),
      Appointment.countDocuments({ doctor: doctor._id, status: "pending" }),
      Appointment.countDocuments({ doctor: doctor._id, status: "completed" }),
    ]);

    return successResponse(res, { total, today: todayCount, pending, completed, rating: doctor.averageRating });
  } catch (err) { next(err); }
};

const getMyPatients = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    const filter = { doctor: doctor._id };
    if (req.query.search) {
      const patients = await Patient.find({
        $or: [
          { medicalHistory: { $regex: req.query.search, $options: "i" } },
        ],
      }).select("_id");
      const users = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
        ],
      }).select("_id");
      filter.$or = [
        { patient: { $in: patients.map(p => p._id) } },
        { "patient.user": { $in: users.map(u => u._id) } },
      ];
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "patient",
        populate: { path: "user", select: "name phone avatar" },
      })
      .sort({ date: -1 });

    // Get unique patients
    const uniquePatients = {};
    appointments.forEach(appt => {
      if (appt.patient) {
        const key = appt.patient._id.toString();
        if (!uniquePatients[key]) {
          uniquePatients[key] = {
            _id: appt.patient._id,
            patientId: appt.patient.patientId,
            name: appt.patient.user?.name,
            phone: appt.patient.user?.phone,
            avatar: appt.patient.user?.avatar,
            age: appt.patient.age,
            gender: appt.patient.gender,
            bloodGroup: appt.patient.bloodGroup,
            lastVisit: appt.date,
            totalRecords: 0,
          };
        }
        uniquePatients[key].totalRecords += 1;
      }
    });

    const patientsList = Object.values(uniquePatients);
    return successResponse(res, { patients: patientsList });
  } catch (err) { next(err); }
};

const getPatientDetail = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return errorResponse(res, "Doctor not found.", 404);

    const patient = await Patient.findById(req.params.patientId)
      .populate("user", "-password -refreshToken");

    if (!patient) return errorResponse(res, "Patient not found.", 404);

    // Get patient's records (appointments with this doctor)
    const appointments = await Appointment.find({
      doctor: doctor._id,
      patient: patient._id,
    })
      .populate("doctor", "specialization")
      .sort({ date: -1 });

    // Get patient's health metrics
    const HealthMetric = require("../models/HealthMetric.model");
    const healthMetrics = await HealthMetric.find({ patient: patient._id }).sort({ createdAt: -1 }).limit(10);

    return successResponse(res, {
      patient,
      appointments,
      healthMetrics,
    });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, updateMyProfile, getAllDoctors, getDoctorById, rateDoctor, getDoctorStats, getMyPatients, getPatientDetail };