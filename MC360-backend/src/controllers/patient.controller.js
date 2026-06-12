const Patient = require("../models/Patient.model");
const User = require("../models/User.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const getMyProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id })
      .populate("user", "-password -refreshToken")
      .populate("assignedDoctor", "specialization consultationFee")
      .populate("hospital", "name address");
    if (!patient) return errorResponse(res, "Patient profile not found.", 404);
    return successResponse(res, { patient });
  } catch (err) { next(err); }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const allowed = [
      "dateOfBirth", "gender", "bloodGroup", "address", "emergencyContact",
      "allergies", "chronicConditions", "height", "weight", "smokingStatus",
      "alcoholConsumption", "insuranceProvider", "insurancePolicyNumber",
    ];
    const updates = {};
    
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (typeof req.body[f] === "object" && !Array.isArray(req.body[f]) && req.body[f] !== null) {
          Object.keys(req.body[f]).forEach(key => {
            updates[`${f}.${key}`] = req.body[f][key];
          });
        } else {
          updates[f] = req.body[f];
        }
      }
    });

    if (req.body.height && req.body.weight) {
      updates.bmi = parseFloat((req.body.weight / Math.pow(req.body.height / 100, 2)).toFixed(1));
    }
    if (req.body.dateOfBirth) {
      updates.age = Math.floor((Date.now() - new Date(req.body.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
    }

    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id }, 
      { $set: updates }, 
      { new: true, runValidators: true }
    ).populate("user", "-password");

    return successResponse(res, { patient }, "Profile updated.");
  } catch (err) { next(err); }
};

const addMedicalHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    patient.medicalHistory.push(req.body);
    await patient.save();
    return successResponse(res, { medicalHistory: patient.medicalHistory }, "Medical history added.");
  } catch (err) { next(err); }
};

// For doctors/hospital to list patients
const getAllPatients = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) {
      const users = await User.find({
        role: "patient",
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }).select("_id");
      filter.user = { $in: users.map((u) => u._id) };
    }
    if (req.user.role === "hospital") {
      filter.hospital = req.body.hospitalId;
    }
    const { data, pagination } = await paginate(Patient, filter, {
      page: req.query.page,
      limit: req.query.limit,
      populate: { path: "user", select: "name email phone avatar" },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("user", "-password -refreshToken")
      .populate("assignedDoctor")
      .populate("hospital", "name");
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    return successResponse(res, { patient });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, updateMyProfile, addMedicalHistory, getAllPatients, getPatientById };