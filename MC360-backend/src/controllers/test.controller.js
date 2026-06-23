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
    if (req.query.status) {
      if (req.query.status === "upcoming") {
        filter.status = { $in: ["ordered", "sample-collected", "processing"] };
      } else {
        filter.status = req.query.status;
      }
    }
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

const bookTest = async (req, res, next) => {
  try {
    const { tests, date, homeCollection, address } = req.body;
    if (!Array.isArray(tests) || tests.length === 0) {
      return errorResponse(res, "Please select at least one test.", 400);
    }
    if (!date) {
      return errorResponse(res, "Preferred date is required.", 400);
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return errorResponse(res, "Patient profile not found.", 404);

    const categoryMap = {
      'Complete Blood Count (CBC)': 'blood',
      'Lipid Profile': 'blood',
      'Blood Sugar (Fasting)': 'blood',
      'HbA1c': 'blood',
      'Thyroid Profile (T3/T4/TSH)': 'blood',
      'Liver Function Test': 'blood',
      'Kidney Function Test': 'blood',
      'Chest X-Ray': 'imaging',
      'Abdominal Ultrasound': 'imaging',
      'ECG': 'cardiology',
      'ECHO': 'cardiology',
      'MRI Brain': 'imaging',
      'CT Scan Abdomen': 'imaging',
      'Urine Routine & Microscopy': 'urine',
      'Urine Culture': 'urine',
      'Stool Routine': 'urine',
    };

    const createdTests = [];
    for (const testName of tests) {
      const test = await Test.create({
        patient: patient._id,
        testName,
        category: categoryMap[testName] || 'other',
        scheduledDate: new Date(date),
        homeCollection,
        collectionAddress: address,
        status: 'ordered'
      });
      createdTests.push(test);
    }

    return successResponse(res, { tests: createdTests }, "Tests booked successfully.", 201);
  } catch (err) { next(err); }
};

const cancelTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return errorResponse(res, "Test not found.", 404);

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient || test.patient.toString() !== patient._id.toString()) {
      return errorResponse(res, "Unauthorized.", 403);
    }

    if (["completed", "cancelled"].includes(test.status)) {
      return errorResponse(res, `Cannot cancel test in ${test.status} status.`, 400);
    }

    test.status = "cancelled";
    await test.save();

    return successResponse(res, { test }, "Test cancelled.");
  } catch (err) { next(err); }
};

module.exports = { orderTest, getMyTests, getTestById, updateTestStatus, collectSample, bookTest, cancelTest };