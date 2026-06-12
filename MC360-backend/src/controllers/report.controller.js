const Report = require("../models/Report.model");
const Patient = require("../models/Patient.model");
const reportService = require("../services/report.service");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const uploadReport = async (req, res, next) => {
  try {
    if (!req.file) return errorResponse(res, "File is required.", 400);
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient profile not found.", 404);
    const report = await reportService.uploadReport(patient._id, req.user._id, req.file, req.body);
    return successResponse(res, { report }, "Report uploaded.", 201);
  } catch (err) { next(err); }
};

const getMyReports = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);
    const filter = { patient: patient._id, isDeleted: false };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" };
    const { data, pagination } = await paginate(Report, filter, {
      page: req.query.page, limit: req.query.limit,
      populate: [{ path: "doctor", populate: { path: "user", select: "name" } }, { path: "hospital", select: "name" }],
      sort: { date: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate({ path: "patient", populate: { path: "user", select: "name" } }).populate({ path: "doctor", populate: { path: "user", select: "name" } });
    if (!report || report.isDeleted) return errorResponse(res, "Report not found.", 404);
    return successResponse(res, { report });
  } catch (err) { next(err); }
};

const deleteReport = async (req, res, next) => {
  try {
    await reportService.deleteReport(req.params.id, req.user._id);
    return successResponse(res, {}, "Report deleted.");
  } catch (err) { next(err); }
};

const summarizeReport = async (req, res, next) => {
  try {
    const summary = await reportService.aiSummarizeReport(req.params.id);
    return successResponse(res, { summary }, "Report summarized.");
  } catch (err) { next(err); }
};

const shareReport = async (req, res, next) => {
  try {
    const { doctorId } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return errorResponse(res, "Report not found.", 404);
    if (!report.sharedWith.includes(doctorId)) {
      report.sharedWith.push(doctorId);
      report.isSharedWithDoctor = true;
      await report.save();
    }
    return successResponse(res, {}, "Report shared with doctor.");
  } catch (err) { next(err); }
};

const getPatientReports = async (req, res, next) => {
  try {
    const filter = { patient: req.params.patientId, isDeleted: false };
    const { data, pagination } = await paginate(Report, filter, { page: req.query.page, limit: req.query.limit, sort: { date: -1 } });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

module.exports = { uploadReport, getMyReports, getReportById, deleteReport, summarizeReport, shareReport, getPatientReports };