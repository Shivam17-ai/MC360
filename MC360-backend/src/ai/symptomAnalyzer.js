import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

/**
 * Analyze symptoms using Gemini AI
 * @param {string[]} symptoms
 * @param {object}   patientContext - { age, gender, medicalHistory }
 */
export const analyzeSymptoms = async (symptoms, patientContext = {}) => {
  const prompt = `
You are a medical triage AI assistant.

Patient Info:
- Age: ${patientContext.age || 'Unknown'}
- Gender: ${patientContext.gender || 'Unknown'}
- Medical History: ${patientContext.medicalHistory?.join(', ') || 'None'}

Reported Symptoms: ${symptoms.join(', ')}

Respond ONLY in this exact JSON format:
{
  "possibleConditions": ["condition1", "condition2", "condition3"],
  "severity": "Low" | "Moderate" | "High" | "Critical",
  "recommendedSpecialist": "specialist name",
  "action": "what the patient should do",
  "redFlags": ["any warning signs to watch for"],
  "disclaimer": "short medical disclaimer"
}
`

  const result  = await model.generateContent(prompt)
  const text    = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()

  return {
    symptoms,
    analysis:  JSON.parse(cleaned),
    timestamp: new Date().toISOString(),
  }
}