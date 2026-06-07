import Report from '../models/Report.model.js'
import { summarizeReport } from '../ai/reportSummarizer.js'
import { sendSuccess, sendError, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js'
import { paginate } from '../utils/paginate.js'
import logger from '../utils/logger.js'

// ── Upload Report ─────────────────────────────────────────────────────────────
export const uploadReport = async (req, res) => {
  try {
    if (!req.file) return sendBadRequest(res, 'No file uploaded')

    const cloudinary = (await import('../config/cloudinary.js')).default
    const uploaded   = await cloudinary.uploader.upload(req.file.path, {
      folder:        'mc360/reports',
      resource_type: 'auto',
    })

    const report = await Report.create({
      patient:    req.user.id,
      name:       req.body.name || req.file.originalname,
      type:       req.body.type || 'Other',
      fileUrl:    uploaded.secure_url,
      fileSize:   req.file.size,
      mimeType:   req.file.mimetype,
      uploadedBy: req.user.id,
      doctor:     req.body.doctorId || null,
    })

    logger.info(`Report uploaded: ${report._id}`)
    return sendCreated(res, report, 'Report uploaded successfully')
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get My Reports ────────────────────────────────────────────────────────────
export const getMyReports = async (req, res) => {
  try {
    const filter = { patient: req.user.id }
    if (req.query.type) filter.type = req.query.type

    const result = await paginate(Report, filter, {
      page:  req.query.page,
      limit: req.query.limit,
      sort:  { createdAt: -1 },
    })
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Report By ID ──────────────────────────────────────────────────────────
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, patient: req.user.id })
    if (!report) return sendNotFound(res, 'Report not found')
    return sendSuccess(res, report)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── AI Summarize Report ───────────────────────────────────────────────────────
export const summarizeReportAI = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return sendNotFound(res, 'Report not found')

    const summary = await summarizeReport(
      report.fileUrl,
      report.mimeType,
      { name: req.user.name, age: req.body.age, gender: req.body.gender }
    )

    report.aiSummary = summary.summary
    await report.save()

    return sendSuccess(res, summary, 'Report summarized')
  } catch (err) {
    logger.error('Report summarize error:', err)
    return sendError(res, err.message)
  }
}

// ── Delete Report ─────────────────────────────────────────────────────────────
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, patient: req.user.id })
    if (!report) return sendNotFound(res, 'Report not found')
    return sendSuccess(res, null, 'Report deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}