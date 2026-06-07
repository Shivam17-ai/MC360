import QueueToken from '../models/QueueToken.model.js'
import { sendSuccess, sendError, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js'

// ── Generate Queue Token ──────────────────────────────────────────────────────
export const generateToken = async (req, res) => {
  try {
    const { doctorId, hospitalId, department } = req.body

    const today     = new Date().setHours(0, 0, 0, 0)
    const lastToken = await QueueToken.findOne({
      doctor:    doctorId,
      createdAt: { $gte: today },
    }).sort({ tokenNumber: -1 })

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1
    const tokenCode   = `${department?.charAt(0) || 'A'}-${String(tokenNumber).padStart(3, '0')}`

    const token = await QueueToken.create({
      patient:     req.user.id,
      doctor:      doctorId,
      hospital:    hospitalId,
      department,
      tokenNumber,
      tokenCode,
      status:      'waiting',
    })

    return sendCreated(res, token, `Token ${tokenCode} generated`)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Token ──────────────────────────────────────────────────────────────
export const getMyToken = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0)
    const token = await QueueToken.findOne({
      patient:   req.user.id,
      createdAt: { $gte: today },
      status:    { $in: ['waiting', 'called'] },
    }).populate('doctor', 'name specialization')

    if (!token) return sendNotFound(res, 'No active token found')

    // Count tokens ahead
    const ahead = await QueueToken.countDocuments({
      doctor:      token.doctor,
      tokenNumber: { $lt: token.tokenNumber },
      status:      'waiting',
      createdAt:   { $gte: today },
    })

    return sendSuccess(res, { ...token.toObject(), ahead, estimatedWait: `${ahead * 10} mins` })
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Queue Board ───────────────────────────────────────────────────────────
export const getQueueBoard = async (req, res) => {
  try {
    const { doctorId } = req.params
    const today = new Date().setHours(0, 0, 0, 0)

    const queue = await QueueToken.find({
      doctor:    doctorId,
      createdAt: { $gte: today },
    })
      .populate('patient', 'name')
      .sort({ tokenNumber: 1 })
      .lean()

    return sendSuccess(res, queue)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Call Next Token ───────────────────────────────────────────────────────────
export const callNextToken = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0)

    const next = await QueueToken.findOneAndUpdate(
      { doctor: req.params.doctorId, status: 'waiting', createdAt: { $gte: today } },
      { status: 'called', calledAt: new Date() },
      { new: true, sort: { tokenNumber: 1 } }
    ).populate('patient', 'name')

    if (!next) return sendNotFound(res, 'No tokens in queue')
    return sendSuccess(res, next, `Token ${next.tokenCode} called`)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Token Status ───────────────────────────────────────────────────────
export const updateTokenStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowed    = ['waiting', 'called', 'completed', 'skipped']
    if (!allowed.includes(status)) return sendBadRequest(res, 'Invalid status')

    const token = await QueueToken.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!token) return sendNotFound(res, 'Token not found')
    return sendSuccess(res, token, `Token ${status}`)
  } catch (err) {
    return sendError(res, err.message)
  }
}