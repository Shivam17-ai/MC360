import Appointment from '../models/Appointment.model.js'
import Doctor from '../models/Doctor.model.js'
import { sendSuccess, sendError, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'
import { sendAppointmentEmail } from '../utils/sendEmail.js'
import logger from '../utils/logger.js'

// ── Book Appointment ──────────────────────────────────────────────────────────
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, type, reason } = req.body

    const doctor = await Doctor.findById(doctorId).populate('user', 'name email')
    if (!doctor)           return sendNotFound(res, 'Doctor not found')
    if (!doctor.isAvailable) return sendBadRequest(res, 'Doctor is not available')

    // Check slot conflict
    const conflict = await Appointment.findOne({ doctor: doctorId, date, time, status: { $ne: 'cancelled' } })
    if (conflict) return sendBadRequest(res, 'This slot is already booked')

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor:  doctorId,
      date,
      time,
      type,
      reason,
      status:  'pending',
    })

    // Send confirmation email
    await sendAppointmentEmail(req.user.email, {
      doctorName: doctor.user.name,
      date,
      time,
      type,
    }).catch(() => {}) // don't fail if email fails

    logger.info(`Appointment booked: patient ${req.user.id} → doctor ${doctorId}`)

    return sendCreated(res, appointment, 'Appointment booked successfully')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Appointments (Patient) ─────────────────────────────────────────────
export const getMyAppointments = async (req, res) => {
  try {
    const filter = { patient: req.user.id }
    if (req.query.status) filter.status = req.query.status

    const result = await paginate(Appointment, filter, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: [
        { path: 'doctor', populate: { path: 'user', select: 'name avatar' } },
      ],
      sort: { date: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Doctor Appointments ───────────────────────────────────────────────────
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
    if (!doctor) return sendNotFound(res, 'Doctor profile not found')

    const filter = { doctor: doctor._id }
    if (req.query.status) filter.status = req.query.status
    if (req.query.date)   filter.date   = req.query.date

    const result = await paginate(Appointment, filter, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: { path: 'patient', select: 'name email phone' },
      sort:     { date: 1, time: 1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Appointment By ID ─────────────────────────────────────────────────────
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .populate('patient', 'name email phone')
    if (!appointment) return sendNotFound(res, 'Appointment not found')
    return sendSuccess(res, appointment)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Appointment Status ─────────────────────────────────────────────────
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancelReason } = req.body
    const allowed = ['confirmed', 'cancelled', 'completed', 'no-show']
    if (!allowed.includes(status)) return sendBadRequest(res, 'Invalid status')

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, cancelReason },
      { new: true }
    )
    if (!appointment) return sendNotFound(res, 'Appointment not found')

    return sendSuccess(res, appointment, `Appointment ${status}`)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Cancel Appointment ────────────────────────────────────────────────────────
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id:     req.params.id,
      patient: req.user.id,
    })
    if (!appointment) return sendNotFound(res, 'Appointment not found')
    if (appointment.status === 'completed') return sendBadRequest(res, 'Cannot cancel a completed appointment')

    appointment.status       = 'cancelled'
    appointment.cancelReason = req.body.reason || 'Cancelled by patient'
    await appointment.save()

    return sendSuccess(res, appointment, 'Appointment cancelled')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Reschedule Appointment ────────────────────────────────────────────────────
export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body

    const conflict = await Appointment.findOne({
      doctor: req.body.doctorId,
      date,
      time,
      status: { $ne: 'cancelled' },
      _id:    { $ne: req.params.id },
    })
    if (conflict) return sendBadRequest(res, 'Slot not available')

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, time, status: 'pending' },
      { new: true }
    )
    if (!appointment) return sendNotFound(res, 'Appointment not found')

    return sendSuccess(res, appointment, 'Appointment rescheduled')
  } catch (err) {
    return sendError(res, err.message)
  }
}