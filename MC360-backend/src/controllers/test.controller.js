import Test from '../models/Test.model.js'
import { sendSuccess, sendError, sendCreated, sendNotFound } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'

// ── Book Test ─────────────────────────────────────────────────────────────────
export const bookTest = async (req, res) => {
  try {
    const { tests, collectionType, collectionDate, collectionTime, address } = req.body

    const booking = await Test.create({
      patient:        req.user.id,
      tests,
      collectionType,
      collectionDate,
      collectionTime,
      address:        collectionType === 'home' ? address : null,
      status:         'booked',
      totalAmount:    tests.reduce((sum, t) => sum + (t.price || 0), 0),
    })

    return sendCreated(res, booking, 'Test booked successfully')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Tests ──────────────────────────────────────────────────────────────
export const getMyTests = async (req, res) => {
  try {
    const result = await paginate(Test, { patient: req.user.id }, {
      page:  req.query.page,
      limit: req.query.limit,
      sort:  { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Test By ID ────────────────────────────────────────────────────────────
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, patient: req.user.id })
    if (!test) return sendNotFound(res, 'Test booking not found')
    return sendSuccess(res, test)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Update Test Status ────────────────────────────────────────────────────────
export const updateTestStatus = async (req, res) => {
  try {
    const { status, reportUrl } = req.body
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { status, reportUrl },
      { new: true }
    )
    if (!test) return sendNotFound(res, 'Test not found')
    return sendSuccess(res, test, 'Test status updated')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Cancel Test ───────────────────────────────────────────────────────────────
export const cancelTest = async (req, res) => {
  try {
    const test = await Test.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.id },
      { status: 'cancelled' },
      { new: true }
    )
    if (!test) return sendNotFound(res, 'Test not found')
    return sendSuccess(res, test, 'Test cancelled')
  } catch (err) {
    return sendError(res, err.message)
  }
}