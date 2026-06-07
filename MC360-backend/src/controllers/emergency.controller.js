import EmergencyAlert from '../models/EmergencyAlert.model.js'
import { sendSuccess, sendError, sendCreated, sendNotFound } from '../utils/response.js'
import logger from '../utils/logger.js'

// ── Trigger Emergency Alert ───────────────────────────────────────────────────
export const triggerAlert = async (req, res) => {
  try {
    const { type, location, description, hospitalId } = req.body

    const alert = await EmergencyAlert.create({
      patient:     req.user.id,
      type,
      location,
      description,
      hospital:    hospitalId,
      status:      'active',
      triggeredAt: new Date(),
    })

    // Emit to socket for real-time alert
    const io = req.app.get('io')
    if (io) {
      io.to(`hospital_${hospitalId}`).emit('emergency_alert', {
        alertId:   alert._id,
        patient:   req.user.id,
        type,
        location,
        triggeredAt: alert.triggeredAt,
      })
    }

    logger.warn(`🚨 Emergency alert triggered by patient: ${req.user.id}`)

    return sendCreated(res, alert, 'Emergency alert triggered')
  } catch (err) {
    logger.error('Emergency alert error:', err)
    return sendError(res, err.message)
  }
}

// ── Get Active Alerts (Hospital) ──────────────────────────────────────────────
export const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ status: 'active' })
      .populate('patient', 'name phone bloodGroup')
      .sort({ triggeredAt: -1 })
    return sendSuccess(res, alerts)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Resolve Alert ─────────────────────────────────────────────────────────────
export const resolveAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolvedAt: new Date(), resolvedBy: req.user.id },
      { new: true }
    )
    if (!alert) return sendNotFound(res, 'Alert not found')

    const io = req.app.get('io')
    if (io) io.emit('emergency_resolved', { alertId: alert._id })

    return sendSuccess(res, alert, 'Alert resolved')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Alerts (Patient) ───────────────────────────────────────────────────
export const getMyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ patient: req.user.id }).sort({ triggeredAt: -1 })
    return sendSuccess(res, alerts)
  } catch (err) {
    return sendError(res, err.message)
  }
}