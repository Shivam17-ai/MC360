const Appointment = require("../models/Appointment.model");
const Patient = require("../models/Patient.model");
const Doctor = require("../models/Doctor.model");
const appointmentService = require("../services/appointment.service");
const paginate = require("../utils/paginate");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment({ patientUserId: req.user._id, ...req.body });
    return successResponse(res, { appointment }, "Appointment booked successfully.", 201);
  } catch (err) { next(err); }
};

const getMyAppointments = async (req, res, next) => {
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

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.from) filter.date = { $gte: new Date(req.query.from) };
    if (req.query.to) filter.date = { ...filter.date, $lte: new Date(req.query.to) };
    // For upcoming (confirmed) appointments, only return future ones
    if (req.query.status === "confirmed" && !req.query.from) {
      filter.date = { ...filter.date, $gte: new Date() };
    }

    const { data, pagination } = await paginate(Appointment, filter, {
      page: req.query.page,
      limit: req.query.limit,
      populate: [
        { path: "doctor", populate: { path: "user", select: "name avatar" } },
        { path: "patient", populate: { path: "user", select: "name avatar phone" } },
        { path: "hospital", select: "name address" },
      ],
      sort: { date: -1 },
    });
    return paginatedResponse(res, data, pagination);
  } catch (err) { next(err); }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: "doctor", populate: { path: "user", select: "name avatar email phone" } })
      .populate({ path: "patient", populate: { path: "user", select: "name avatar email phone" } })
      .populate("hospital", "name address phone")
      .populate("prescription");
    if (!appointment) return errorResponse(res, "Appointment not found.", 404);
    return successResponse(res, { appointment });
  } catch (err) { next(err); }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.user._id, req.body.reason);
    return successResponse(res, { appointment }, "Appointment cancelled.");
  } catch (err) { next(err); }
};

const rescheduleAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.rescheduleAppointment(req.params.id, req.body);
    return successResponse(res, { appointment }, "Appointment rescheduled.");
  } catch (err) { next(err); }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes, followUpRequired } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status, notes, followUpRequired }, { new: true });
    if (!appointment) return errorResponse(res, "Appointment not found.", 404);
    return successResponse(res, { appointment }, "Status updated.");
  } catch (err) { next(err); }
};

const getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!date) return errorResponse(res, "Date is required.", 400);
    const availability = await appointmentService.getDoctorAvailability(doctorId, date);
    return successResponse(res, { availability });
  } catch (err) { next(err); }
};

const rateAppointment = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { rating, review }, { new: true });
    if (!appointment) return errorResponse(res, "Appointment not found.", 404);

    // Update doctor average rating
    const Doctor = require("../models/Doctor.model");
    const doctor = await Doctor.findById(appointment.doctor);
    if (doctor) {
      const newTotal = doctor.totalRatings + 1;
      doctor.averageRating = parseFloat(((doctor.averageRating * doctor.totalRatings + rating) / newTotal).toFixed(1));
      doctor.totalRatings = newTotal;
      await doctor.save();
    }
    return successResponse(res, { appointment }, "Rating submitted.");
  } catch (err) { next(err); }
};

module.exports = { bookAppointment, getMyAppointments, getAppointmentById, cancelAppointment, rescheduleAppointment, updateAppointmentStatus, getDoctorAvailability, rateAppointment };