import Prescription from '../models/Prescription.model.js'
import Doctor from '../models/Doctor.model.js'
import { sendSuccess, sendError, sendCreated, sendNotFound, sendForbidden } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'

// ── Create Prescription ───────────────────────────────────────────────────────
export const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, diagnosis, notes, followUpDate } = req.body

    const doctor = await Doctor.findOne({ user: req.user.id })
    if (!doctor) return sendNotFound(res, 'Doctor profile not found')

    const prescription = await Prescription.create({
      doctor:        doctor._id,
      patient:       patientId,
      appointment:   appointmentId,
      medicines,
      diagnosis,
      notes,
      followUpDate,
    })

    return sendCreated(res, prescription, 'Prescription created')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Prescriptions (Patient) ────────────────────────────────────────────
export const getMyPrescriptions = async (req, res) => {
  try {
    const result = await paginate(Prescription, { patient: req.user.id }, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: [
        { path: 'doctor', populate: { path: 'user', select: 'name' } },
      ],
      sort: { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Doctor's Prescriptions ────────────────────────────────────────────────
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
    const result = await paginate(Prescription, { doctor: doctor._id }, {
      page:     req.query.page,
      limit:    req.query.limit,
      populate: { path: 'patient', select: 'name email' },
      sort:     { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Prescription By ID ────────────────────────────────────────────────────
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('patient', 'name email phone')
    if (!prescription) return sendNotFound(res, 'Prescription not found')
    return sendSuccess(res, prescription)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Prescription ───────────────────────────────────────────────────────
export const updatePrescription = async (req, res) => {
  try {
    const doctor       = await Doctor.findOne({ user: req.user.id })
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, doctor: doctor._id },
      req.body,
      { new: true }
    )
    if (!prescription) return sendNotFound(res, 'Prescription not found')
    return sendSuccess(res, prescription, 'Prescription updated')
  } catch (err) {
    return sendError(res, err.message)
  }
}