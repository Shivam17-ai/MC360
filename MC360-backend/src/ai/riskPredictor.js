import axios from 'axios'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001'

/**
 * Predict disease risk using Python Flask ML microservice
 * @param {string} disease  - 'diabetes' | 'heart' | 'obesity'
 * @param {object} features - patient health metrics
 */
export const predictRisk = async (disease, features) => {
  const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
    disease,
    features,
  })

  return {
    disease,
    features,
    result:    response.data,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Get all risk predictions for a patient
 * @param {object} patientMetrics
 */
export const getFullRiskProfile = async (patientMetrics) => {
  const diseases = ['diabetes', 'heart', 'obesity']

  const results = await Promise.allSettled(
    diseases.map((d) => predictRisk(d, patientMetrics))
  )

  return results.map((r, i) => ({
    disease: diseases[i],
    status:  r.status,
    data:    r.status === 'fulfilled' ? r.value : null,
    error:   r.status === 'rejected'  ? r.reason?.message : null,
  }))
}