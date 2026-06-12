const Hospital = require("../models/Hospital.model");
const Doctor = require("../models/Doctor.model");
const Patient = require("../models/Patient.model");
const Appointment = require("../models/Appointment.model");
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
      if (hospital?.logoPublicId) await deleteFromCloudinary(hospital.logoPublicId).catch(() => {});
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
    const [totalDoctors, totalPatients, todayAppointments, totalAppointments] = await Promise.all([
      Doctor.countDocuments({ hospital: hospital._id }),
      Patient.countDocuments({ hospital: hospital._id }),
      Appointment.countDocuments({ hospital: hospital._id, date: { $gte: today } }),
      Appointment.countDocuments({ hospital: hospital._id }),
    ]);

    return successResponse(res, { totalDoctors, totalPatients, todayAppointments, totalAppointments, availableBeds: hospital.availableBeds, totalBeds: hospital.totalBeds });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, updateMyProfile, getAllHospitals, getHospitalById, addDoctor, removeDoctor, getHospitalStats };