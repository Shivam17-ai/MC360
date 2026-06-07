import HealthMetric from '../models/HealthMetric.model.js'
import { sendSuccess, sendError, sendCreated, sendNotFound } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'

// ── Add Health Metric ─────────────────────────────────────────────────────────
export const addMetric = async (req, res) => {
  try {
    const { type, value, unit, notes, recordedAt } = req.body

    const metric = await HealthMetric.create({
      patient:    req.user.id,
      type,
      value,
      unit,
      notes,
      recordedAt: recordedAt || new Date(),
    })
    return sendCreated(res, metric, 'Metric recorded')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Metrics ────────────────────────────────────────────────────────────
export const getMyMetrics = async (req, res) => {
  try {
    const filter = { patient: req.user.id }
    if (req.query.type) filter.type = req.query.type
    if (req.query.from || req.query.to) {
      filter.recordedAt = {}
      if (req.query.from) filter.recordedAt.$gte = new Date(req.query.from)
      if (req.query.to)   filter.recordedAt.$lte = new Date(req.query.to)
    }

    const result = await paginate(HealthMetric, filter, {
      page:  req.query.page,
      limit: req.query.limit || 30,
      sort:  { recordedAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Latest Metrics ────────────────────────────────────────────────────────
export const getLatestMetrics = async (req, res) => {
  try {
    const types = ['blood_pressure', 'weight', 'blood_sugar', 'heart_rate', 'oxygen_saturation']

    const latest = await Promise.all(
      types.map((type) =>
        HealthMetric.findOne({ patient: req.user.id, type })
          .sort({ recordedAt: -1 })
          .lean()
      )
    )

    const result = {}
    types.forEach((type, i) => { result[type] = latest[i] })

    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Metric Trends ─────────────────────────────────────────────────────────
export const getMetricTrends = async (req, res) => {
  try {
    const { type, days = 30 } = req.query
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const metrics = await HealthMetric.find({
      patient:    req.user.id,
      type,
      recordedAt: { $gte: from },
    }).sort({ recordedAt: 1 }).lean()

    return sendSuccess(res, metrics)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Delete Metric ─────────────────────────────────────────────────────────────
export const deleteMetric = async (req, res) => {
  try {
    const metric = await HealthMetric.findOneAndDelete({ _id: req.params.id, patient: req.user.id })
    if (!metric) return sendNotFound(res, 'Metric not found')
    return sendSuccess(res, null, 'Metric deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}