import DietPlan from '../models/DietPlan.model.js'
import { generateDietPlan } from '../ai/dietGenerator.js'
import { sendSuccess, sendError, sendCreated, sendNotFound } from '../utils/response.js'
import logger from '../utils/logger.js'

// ── Generate AI Diet Plan ─────────────────────────────────────────────────────
export const generatePlan = async (req, res) => {
  try {
    const result = await generateDietPlan(req.body)

    const plan = await DietPlan.create({
      patient:  req.user.id,
      input:    req.body,
      plan:     result.dietPlan,
      isActive: true,
    })

    return sendCreated(res, plan, 'Diet plan generated')
  } catch (err) {
    logger.error('Diet plan error:', err)
    return sendError(res, err.message)
  }
}

// ── Get My Diet Plans ─────────────────────────────────────────────────────────
export const getMyPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ patient: req.user.id }).sort({ createdAt: -1 })
    return sendSuccess(res, plans)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Get Active Plan ───────────────────────────────────────────────────────────
export const getActivePlan = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ patient: req.user.id, isActive: true })
    if (!plan) return sendNotFound(res, 'No active diet plan found')
    return sendSuccess(res, plan)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Delete Plan ───────────────────────────────────────────────────────────────
export const deletePlan = async (req, res) => {
  try {
    const plan = await DietPlan.findOneAndDelete({ _id: req.params.id, patient: req.user.id })
    if (!plan) return sendNotFound(res, 'Plan not found')
    return sendSuccess(res, null, 'Diet plan deleted')
  } catch (err) {
    return sendError(res, err.message)
  }
}