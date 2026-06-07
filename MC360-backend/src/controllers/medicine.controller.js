import Medicine from '../models/Medicine.model.js'
import { checkDrugInteractions } from '../ai/drugInteractionDB.js'
import { sendSuccess, sendError, sendCreated, sendNotFound } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'

// ── Add Medicine ──────────────────────────────────────────────────────────────
export const addMedicine = async (req, res) => {
  try {
    const { name, dose, frequency, times, startDate, endDate, instructions, prescriptionId } = req.body

    const medicine = await Medicine.create({
      patient: req.user.id,
      name, dose, frequency, times,
      startDate, endDate,
      instructions, prescriptionId,
    })
    return sendCreated(res, medicine, 'Medicine added')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Medicines ──────────────────────────────────────────────────────────
export const getMyMedicines = async (req, res) => {
  try {
    const filter = { patient: req.user.id }
    if (req.query.active === 'true') filter.endDate = { $gte: new Date() }

    const result = await paginate(Medicine, filter, {
      page:  req.query.page,
      limit: req.query.limit,
      sort:  { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Mark Medicine As Taken ────────────────────────────────────────────────────
export const markMedicineTaken = async (req, res) => {
  try {
    const { date, time } = req.body
    const medicine = await Medicine.findOne({ _id: req.params.id, patient: req.user.id })
    if (!medicine) return sendNotFound(res, 'Medicine not found')

    medicine.adherenceLog.push({ date: date || new Date(), time, taken: true })
    await medicine.save()

    return sendSuccess(res, medicine, 'Marked as taken')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Medicine ───────────────────────────────────────────────────────────
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.id },
      req.body,
      { new: true }
    )
    if (!medicine) return sendNotFound(res, 'Medicine not found')
    return sendSuccess(res, medicine, 'Medicine updated')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Delete Medicine ───────────────────────────────────────────────────────────
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, patient: req.user.id })
    if (!medicine) return sendNotFound(res, 'Medicine not found')
    return sendSuccess(res, null, 'Medicine deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Check Drug Interactions ───────────────────────────────────────────────────
export const checkInteractions = async (req, res) => {
  try {
    const { drugs, patientInfo } = req.body
    const result = await checkDrugInteractions(drugs, patientInfo)
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}