exports.getAnalytics = (req, res) => res.send('get analytics');
import Appointment  from '../models/Appointment.model.js'
import Patient      from '../models/Patient.model.js'
import Doctor       from '../models/Doctor.model.js'
import HealthMetric from '../models/HealthMetric.model.js'
import Medicine     from '../models/Medicine.model.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ── Hospital Analytics ────────────────────────────────────────────────────────
export const getHospitalAnalytics = async (req, res) => {
  try {
    const { from, to } = req.query
    const dateFilter   = {}
    if (from || to) {
      dateFilter.createdAt = {}
      if (from) dateFilter.createdAt.$gte = new Date(from)
      if (to)   dateFilter.createdAt.$lte = new Date(to)
    }

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      appointmentsByDay,
      appointmentsByStatus,
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(dateFilter),
      Appointment.countDocuments({ ...dateFilter, status: 'completed' }),
      Appointment.countDocuments({ ...dateFilter, status: 'cancelled' }),

      // Appointments grouped by day (last 7 days)
      Appointment.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Appointments by status
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ])

    return sendSuccess(res, {
      overview: { totalPatients, totalDoctors, totalAppointments, completedAppointments, cancelledAppointments },
      appointmentsByDay,
      appointmentsByStatus,
    })
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Patient Health Analytics ──────────────────────────────────────────────────
export const getPatientAnalytics = async (req, res) => {
  try {
    const patientId = req.user.id
    const days      = parseInt(req.query.days) || 30
    const from      = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [metrics, adherence, appointments] = await Promise.all([
      // Health metrics trends
      HealthMetric.aggregate([
        { $match: { patient: patientId, recordedAt: { $gte: from } } },
        { $group: {
          _id:      { type: '$type', date: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } } },
          avgValue: { $avg: '$value' },
        }},
        { $sort: { '_id.date': 1 } },
      ]),

      // Medicine adherence
      Medicine.aggregate([
        { $match: { patient: patientId } },
        { $project: {
          name:          1,
          totalDoses:    { $size: '$adherenceLog' },
          takenDoses:    { $size: { $filter: { input: '$adherenceLog', as: 'log', cond: { $eq: ['$$log.taken', true] } } } },
        }},
      ]),

      // Appointment history count
      Appointment.countDocuments({ patient: patientId }),
    ])

    return sendSuccess(res, { metrics, adherence, totalAppointments: appointments })
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Doctor Analytics ──────────────────────────────────────────────────────────
export const getDoctorAnalytics = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })

    const [total, completed, cancelled, byMonth] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'completed' }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'cancelled' }),
      Appointment.aggregate([
        { $match: { doctor: doctor._id } },
        { $group: {
          _id:   { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        }},
        { $sort: { _id: 1 } },
        { $limit: 6 },
      ]),
    ])

    return sendSuccess(res, { total, completed, cancelled, byMonth })
  } catch (err) {
    return sendError(res, err.message)
  }
}