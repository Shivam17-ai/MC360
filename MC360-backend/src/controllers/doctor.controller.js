import Doctor from '../models/Doctor.model.js'
import User from '../models/User.model.js'
import { sendSuccess, sendError, sendNotFound, sendBadRequest } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'
import logger from '../utils/logger.js'

// ── Get My Profile ────────────────────────────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
      .populate('user', 'name email phone')
    if (!doctor) return sendNotFound(res, 'Doctor profile not found')
    return sendSuccess(res, doctor)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update My Profile ─────────────────────────────────────────────────────────
export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, specialization, qualifications, experience, consultationFee, availableSlots, bio } = req.body

    await User.findByIdAndUpdate(req.user.id, { name, phone })

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { specialization, qualifications, experience, consultationFee, availableSlots, bio },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')

    return sendSuccess(res, doctor, 'Profile updated')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get All Doctors ───────────────────────────────────────────────────────────
export const getAllDoctors = async (req, res) => {
  try {
    const filter = {}
    if (req.query.specialization) filter.specialization = req.query.specialization
    if (req.query.available)      filter.isAvailable    = req.query.available === 'true'

    const result = await paginate(Doctor, filter, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: { path: 'user', select: 'name email phone avatar' },
      sort:     { rating: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Doctor By ID ──────────────────────────────────────────────────────────
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone avatar')
    if (!doctor) return sendNotFound(res, 'Doctor not found')
    return sendSuccess(res, doctor)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Search Doctors ────────────────────────────────────────────────────────────
export const searchDoctors = async (req, res) => {
  try {
    const { q, specialization, minFee, maxFee, rating } = req.query
    const filter = {}

    if (specialization) filter.specialization = { $regex: specialization, $options: 'i' }
    if (minFee || maxFee) {
      filter.consultationFee = {}
      if (minFee) filter.consultationFee.$gte = Number(minFee)
      if (maxFee) filter.consultationFee.$lte = Number(maxFee)
    }
    if (rating) filter.rating = { $gte: Number(rating) }

    let query = Doctor.find(filter).populate('user', 'name email phone avatar')

    if (q) {
      const users = await User.find({ name: { $regex: q, $options: 'i' }, role: 'doctor' }).select('_id')
      query = Doctor.find({ ...filter, user: { $in: users.map((u) => u._id) } })
        .populate('user', 'name email phone avatar')
    }

    const doctors = await query.sort({ rating: -1 }).limit(20)
    return sendSuccess(res, doctors)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Toggle Availability ───────────────────────────────────────────────────────
export const toggleAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
    if (!doctor) return sendNotFound(res, 'Doctor not found')

    doctor.isAvailable = !doctor.isAvailable
    await doctor.save()

    return sendSuccess(res, { isAvailable: doctor.isAvailable }, `You are now ${doctor.isAvailable ? 'available' : 'unavailable'}`)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Available Slots ────────────────────────────────────────────────────
export const updateSlots = async (req, res) => {
  try {
    const { slots } = req.body
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { availableSlots: slots },
      { new: true }
    )
    return sendSuccess(res, doctor, 'Slots updated')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Delete Doctor ─────────────────────────────────────────────────────────────
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id)
    if (!doctor) return sendNotFound(res, 'Doctor not found')
    await User.findByIdAndUpdate(doctor.user, { isActive: false })
    logger.info(`Doctor deleted: ${req.params.id}`)
    return sendSuccess(res, null, 'Doctor deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}