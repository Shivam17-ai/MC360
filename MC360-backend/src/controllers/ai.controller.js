import { analyzeSymptoms }      from '../ai/symptomAnalyzer.js'
import { triagePatient }        from '../ai/triageEngine.js'
import { predictRisk, getFullRiskProfile } from '../ai/riskPredictor.js'
import { generateDietPlan }     from '../ai/dietGenerator.js'
import { checkDrugInteractions } from '../ai/drugInteractionDB.js'
import SymptomLog               from '../models/SymptomLog.model.js'
import RiskPrediction           from '../models/RiskPrediction.model.js'
import { sendSuccess, sendError, sendBadRequest } from '../utils/response.js'
import logger from '../utils/logger.js'

// ── Analyze Symptoms ──────────────────────────────────────────────────────────
export const analyzeSymptomsList = async (req, res) => {
  try {
    const { symptoms, patientContext } = req.body
    if (!symptoms?.length) return sendBadRequest(res, 'Symptoms are required')

    const result = await analyzeSymptoms(symptoms, patientContext)

    await SymptomLog.create({
      patient:  req.user.id,
      symptoms,
      analysis: result.analysis,
    })

    return sendSuccess(res, result)
  } catch (err) {
    logger.error('Symptom analysis error:', err)
    return sendError(res, err.message)
  }
}

// ── Triage Patient ────────────────────────────────────────────────────────────
export const triage = async (req, res) => {
  try {
    const result = await triagePatient(req.body)
    return sendSuccess(res, result)
  } catch (err) {
    logger.error('Triage error:', err)
    return sendError(res, err.message)
  }
}

// ── Predict Disease Risk ──────────────────────────────────────────────────────
export const predictDiseaseRisk = async (req, res) => {
  try {
    const { disease, features } = req.body
    if (!disease || !features) return sendBadRequest(res, 'Disease and features are required')

    const result = await predictRisk(disease, features)

    await RiskPrediction.create({
      patient:  req.user.id,
      disease,
      features,
      result:   result.result,
    })

    return sendSuccess(res, result)
  } catch (err) {
    logger.error('Risk prediction error:', err)
    return sendError(res, err.message)
  }
}

// ── Full Risk Profile ─────────────────────────────────────────────────────────
export const fullRiskProfile = async (req, res) => {
  try {
    const result = await getFullRiskProfile(req.body)
    return sendSuccess(res, result)
  } catch (err) {
    return sendError(res, err.message)
  }
}

// ── Generate Diet Plan ────────────────────────────────────────────────────────
export const generateDiet = async (req, res) => {
  try {
    const result = await generateDietPlan(req.body)
    return sendSuccess(res, result)
  } catch (err) {
    logger.error('Diet generation error:', err)
    return sendError(res, err.message)
  }
}

// ── Drug Interaction Check ────────────────────────────────────────────────────
export const drugInteraction = async (req, res) => {
  try {
    const { drugs, patientInfo } = req.body
    if (!drugs || drugs.length < 2) return sendBadRequest(res, 'At least 2 drugs required')

    const result = await checkDrugInteractions(drugs, patientInfo)
    return sendSuccess(res, result)
  } catch (err) {
    logger.error('Drug interaction error:', err)
    return sendError(res, err.message)
  }
}