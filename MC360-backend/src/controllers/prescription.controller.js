const Prescription = require("../models/Prescription.model");
const Doctor = require("../models/Doctor.model");
const Patient = require("../models/Patient.model");
const Appointment = require("../models/Appointment.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const createPrescription = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return errorResponse(res, "Doctor profile not found.", 404);

    const { patientId, ...rest } = req.body;
    let patient;

    // Check if patientId is a valid MongoDB ID, if not try finding by custom patientId string
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(patientId);
    if (isMongoId) {
      patient = await Patient.findById(patientId);
    } else {
      // Allow searching by P-XXXXX or without prefix
      const searchId = patientId.startsWith('P-') ? patientId : `P-${patientId.padStart(5, '0')}`;
      patient = await Patient.findOne({ patientId: { $regex: new RegExp(patientId.replace('P-', ''), 'i') } });
      // Fallback: try exact match with the prefix we expect
      if (!patient) {
        patient = await Patient.findOne({ patientId: patientId.toUpperCase() });
      }
    }

    if (!patient) return errorResponse(res, "Patient not found with the provided ID.", 422);

    // 1. Check for existing prescriptions to determine if it's a first-time diagnosis or refill
    const prescriptionCount = await Prescription.countDocuments({ patient: patient._id });

    if (prescriptionCount === 0) {
      if (!rest.diagnosis || rest.diagnosis.trim() === '') {
        return errorResponse(res, "Full diagnosis is required for the first prescription. Please provide a diagnosis.", 400);
      }
    } else {
      // 2. For refills, check if the patient has had a regular check-up (completed appt in last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const recentCheckup = await Appointment.findOne({
        patient: patient._id,
        status: 'completed',
        date: { $gte: ninetyDaysAgo }
      });

      if (!recentCheckup && (!rest.diagnosis || rest.diagnosis.trim() === '')) {
        return errorResponse(res, "A new diagnosis is required because no regular check-up was found in the last 90 days. Refills are only permitted with regular check-ups.", 400);
      }
    }

    const prescription = await Prescription.create({ 
      ...rest, 
      patient: patient._id, 
      doctor: doctor._id, 
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    });

    // Auto-create medicine reminders
    if (prescription.medicines?.length > 0) {
      const Medicine = require("../models/Medicine.model");
      const medicinePromises = prescription.medicines.map((med) =>
        Medicine.create({ patient: prescription.patient, name: med.name, genericName: med.genericName, dosage: med.dosage, frequency: med.frequency || "once-daily", instructions: med.instructions, startDate: new Date(), prescriptionId: prescription._id, isActive: true, reminderEnabled: true })
      );
      await Promise.allSettled(medicinePromises);
    }

    return successResponse(res, { prescription }, "Prescription created.", 201);
  } catch (err) { next(err); }
};

const getMyPrescriptions = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) return errorResponse(res, "Patient not found.", 404);
      filter.patient = patient._id;
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) return errorResponse(res, "Doctor not found.", 404);
      filter.doctor = doctor._id;
    }
    if (req.query.active === "true") filter.isActive = true;

    const { data, pagination } = await paginate(Prescription, filter, {
      page: req.query.page, limit: req.query.limit,
      populate: [
        { path: "doctor", populate: { path: "user", select: "name" } },
        { path: "patient", populate: { path: "user", select: "name" } },
        { path: "appointment", select: "date timeSlot" },
      ],
      sort: { createdAt: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
      .populate({ path: "patient", populate: { path: "user", select: "name email" } })
      .populate("hospital", "name").populate("appointment");
    if (!prescription) return errorResponse(res, "Prescription not found.", 404);
    return successResponse(res, { prescription });
  } catch (err) { next(err); }
};

const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return errorResponse(res, "Prescription not found.", 404);
    return successResponse(res, { prescription }, "Prescription updated.");
  } catch (err) { next(err); }
};

module.exports = { createPrescription, getMyPrescriptions, getPrescriptionById, updatePrescription };