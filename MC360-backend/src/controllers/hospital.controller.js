import Hospital from '../models/Hospital.model.js'
import User from '../models/User.model.js'
import Doctor from '../models/Doctor.model.js'
import Appointment from '../models/Appointment.model.js'
import { sendSuccess, sendError, sendNotFound } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'

// ── Get My Hospital ───────────────────────────────────────────────────────────
export const getMyHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user.id })
      .populate('user', 'name email phone')
    if (!hospital) return sendNotFound(res, 'Hospital not found')
    return sendSuccess(res, hospital)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Hospital ───────────────────────────────────────────────────────────
export const updateHospital = async (req, res) => {
  try {
    const { name, address, phone, specializations, beds, facilities, description } = req.body

    const hospital = await Hospital.findOneAndUpdate(
      { user: req.user.id },
      { name, address, phone, specializations, beds, facilities, description },
      { new: true, runValidators: true }
    )
    return sendSuccess(res, hospital, 'Hospital updated')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get All Hospitals ─────────────────────────────────────────────────────────
export const getAllHospitals = async (req, res) => {
  try {
    const result = await paginate(Hospital, {}, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: { path: 'user', select: 'name email' },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Hospital Stats ────────────────────────────────────────────────────────
export const getHospitalStats = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user.id })

    const [totalDoctors, totalAppointments, todayAppointments, pendingAppointments] = await Promise.all([
      Doctor.countDocuments({ hospital: hospital._id }),
      Appointment.countDocuments({ hospital: hospital._id }),
      Appointment.countDocuments({
        hospital:  hospital._id,
        date:      {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Appointment.countDocuments({ hospital: hospital._id, status: 'pending' }),
    ])

    return sendSuccess(res, {
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
    })
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Add Doctor To Hospital ────────────────────────────────────────────────────
export const addDoctorToHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user.id })
    const doctor   = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { hospital: hospital._id },
      { new: true }
    )
    if (!doctor) return sendNotFound(res, 'Doctor not found')
    return sendSuccess(res, doctor, 'Doctor added to hospital')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Remove Doctor From Hospital ───────────────────────────────────────────────
export const removeDoctorFromHospital = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { $unset: { hospital: '' } },
      { new: true }
    )
    if (!doctor) return sendNotFound(res, 'Doctor not found')
    return sendSuccess(res, null, 'Doctor removed from hospital')
  } catch (err) {
    return sendError(res, err.message)
  }
}