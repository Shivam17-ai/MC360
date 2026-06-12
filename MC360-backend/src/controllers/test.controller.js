const Test = require("../models/Test.model");
const Patient = require("../models/Patient.model");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const orderTest = async (req, res, next) => {
  try {
    const { patientId, testName, testCode, category, scheduledDate, fee, notes } = req.body;
    const doctor = req.user.role === "doctor" ? await require("../models/Doctor.model").findOne({ user: req.user._id }) : null;

    const test = await Test.create({
      patient: patientId,
      orderedBy: doctor?._id,
      hospital: req.body.hospitalId,
      testName, testCode, category,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      fee: fee || 0,
      notes,
    });

    return successResponse(res, { test }, "Test ordered.", 201);
  } catch (err) { next(err); }
};

const getMyTests = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient not found.", 404);

    const filter = { patient: patient._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const { data, pagination } = await paginate(Test, filter, {
      page: req.query.page, limit: req.query.limit,
      populate: [{ path: "orderedBy", populate: { path: "user", select: "name" } }, { path: "hospital", select: "name" }],
      sort: { createdAt: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate({ path: "orderedBy", populate: { path: "user", select: "name" } })
      .populate("patient").populate("hospital", "name address").populate("report");
    if (!test) return errorResponse(res, "Test not found.", 404);
    return successResponse(res, { test });
  } catch (err) { next(err); }
};

const updateTestStatus = async (req, res, next) => {
  try {
    const { status, results, completedDate } = req.body;
    const test = await Test.findByIdAndUpdate(req.params.id, { status, results, completedDate: completedDate ? new Date(completedDate) : undefined }, { new: true });
    if (!test) return errorResponse(res, "Test not found.", 404);
    return successResponse(res, { test }, "Test updated.");
  } catch (err) { next(err); }
};

const collectSample = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, { sampleCollected: true, sampleCollectedAt: new Date(), status: "sample-collected" }, { new: true });
    if (!test) return errorResponse(res, "Test not found.", 404);
    return successResponse(res, { test }, "Sample collected.");
  } catch (err) { next(err); }
};

module.exports = { orderTest, getMyTests, getTestById, updateTestStatus, collectSample };