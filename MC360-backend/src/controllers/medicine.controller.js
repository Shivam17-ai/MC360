const Medicine = require("../models/Medicine.model");
const Patient = require("../models/Patient.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const addMedicine = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const medicine = await Medicine.create({ ...req.body, patient: patient._id });
    return successResponse(res, { medicine }, "Medicine added.", 201);
  } catch (err) { next(err); }
};

const getMyMedicines = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const filter = { patient: patient._id };
    if (req.query.active === "true") filter.isActive = true;
    if (req.query.active === "false") filter.isActive = false;

    const { data, pagination } = await paginate(Medicine, filter, {
      page: req.query.page, limit: req.query.limit,
      populate: { path: "prescriptionId", select: "prescriptionId diagnosis" },
      sort: { createdAt: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("prescriptionId");
    if (!medicine) return errorResponse(res, "Medicine not found.", 404);
    return successResponse(res, { medicine });
  } catch (err) { next(err); }
};

const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medicine) return errorResponse(res, "Medicine not found.", 404);
    return successResponse(res, { medicine }, "Medicine updated.");
  } catch (err) { next(err); }
};

const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return errorResponse(res, "Medicine not found.", 404);
    return successResponse(res, {}, "Medicine removed.");
  } catch (err) { next(err); }
};

const logAdherence = async (req, res, next) => {
  try {
    const { date, taken, takenAt, skippedReason } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return errorResponse(res, "Medicine not found.", 404);

    medicine.adherenceLogs.push({ date: new Date(date), taken, takenAt: takenAt ? new Date(takenAt) : undefined, skippedReason });
    medicine.totalDoses += 1;
    if (taken) medicine.takenDoses += 1;
    medicine.adherencePercentage = medicine.calculateAdherence();
    await medicine.save();

    return successResponse(res, { adherencePercentage: medicine.adherencePercentage }, "Adherence logged.");
  } catch (err) { next(err); }
};

const getAdherenceStats = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const medicines = await Medicine.find({ patient: patient._id, isActive: true }).select("name adherencePercentage totalDoses takenDoses adherenceLogs");
    const overall = medicines.length
      ? Math.round(medicines.reduce((sum, m) => sum + m.adherencePercentage, 0) / medicines.length)
      : 0;

    return successResponse(res, { medicines, overallAdherence: overall });
  } catch (err) { next(err); }
};

const checkDrugInteractions = async (req, res, next) => {
  try {
    const { drugs } = req.body;
    const patient = await Patient.findOne({ user: req.user._id });
    const drugInteractionService = require("../services/drugInteraction.service");
    const result = await drugInteractionService.checkInteractions(drugs, patient?._id, req.user._id);
    return successResponse(res, { result });
  } catch (err) { next(err); }
};

module.exports = { addMedicine, getMyMedicines, getMedicineById, updateMedicine, deleteMedicine, logAdherence, getAdherenceStats, checkDrugInteractions };