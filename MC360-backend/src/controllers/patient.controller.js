import Patient from '../models/Patient.model.js'
import User from '../models/User.model.js'
import { sendSuccess, sendError, sendNotFound, sendBadRequest } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'
import logger from '../utils/logger.js'

// ── Get My Profile ────────────────────────────────────────────────────────────
export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id })
      .populate('user', 'name email phone')
    if (!patient) return sendNotFound(res, 'Patient profile not found')
    return sendSuccess(res, patient)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update My Profile ─────────────────────────────────────────────────────────
export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, dob, gender, bloodGroup, address, emergencyContact, allergies, medicalHistory } = req.body

    await User.findByIdAndUpdate(req.user.id, { name, phone })

    const patient = await Patient.findOneAndUpdate(
      { user: req.user.id },
      { dob, gender, bloodGroup, address, emergencyContact, allergies, medicalHistory },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')

    return sendSuccess(res, patient, 'Profile updated successfully')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get All Patients (Hospital/Admin) ─────────────────────────────────────────
export const getAllPatients = async (req, res) => {
  try {
    const result = await paginate(Patient, {}, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: { path: 'user', select: 'name email phone' },
      sort:     { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Patient By ID ─────────────────────────────────────────────────────────
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email phone')
    if (!patient) return sendNotFound(res, 'Patient not found')
    return sendSuccess(res, patient)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Upload Avatar ─────────────────────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return sendBadRequest(res, 'No file uploaded')

    const cloudinary = (await import('../config/cloudinary.js')).default
    const result     = await cloudinary.uploader.upload(req.file.path, {
      folder:         'mc360/avatars',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    })

    await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url })

    return sendSuccess(res, { avatar: result.secure_url }, 'Avatar uploaded')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Delete Patient ────────────────────────────────────────────────────────────
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) return sendNotFound(res, 'Patient not found')
    await User.findByIdAndUpdate(patient.user, { isActive: false })
    logger.info(`Patient deleted: ${req.params.id}`)
    return sendSuccess(res, null, 'Patient deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}