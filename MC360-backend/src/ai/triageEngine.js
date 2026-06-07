import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

/**
 * Triage patient using vitals + symptoms via Gemini
 * @param {object} data - { vitals, symptoms, age, chiefComplaint }
 */
export const triagePatient = async (data) => {
  const { vitals = {}, symptoms = [], age, chiefComplaint } = data

  const prompt = `
You are a hospital triage nurse AI.

Patient Data:
- Age: ${age}
- Chief Complaint: ${chiefComplaint}
- Symptoms: ${symptoms.join(', ')}
- Vitals:
  - Heart Rate: ${vitals.heartRate || 'N/A'} bpm
  - Blood Pressure: ${vitals.systolicBP || 'N/A'}/${vitals.diastolicBP || 'N/A'} mmHg
  - Oxygen Saturation: ${vitals.oxygenSaturation || 'N/A'}%
  - Temperature: ${vitals.temperature || 'N/A'} °C
  - Respiratory Rate: ${vitals.respiratoryRate || 'N/A'} breaths/min

Assign a triage level and respond ONLY in this exact JSON:
{
  "triageLevel": 1 | 2 | 3 | 4 | 5,
  "label": "Immediate" | "Urgent" | "Less Urgent" | "Non-Urgent" | "Refer",
  "color": "red" | "orange" | "yellow" | "green" | "blue",
  "reasoning": "brief clinical reasoning",
  "immediateAction": "what staff should do right now",
  "estimatedWaitMinutes": number
}

Triage Scale:
1 = Immediate (life-threatening)
2 = Urgent (15 mins)
3 = Less Urgent (30-60 mins)
4 = Non-Urgent (1-2 hrs)
5 = Refer to OPD
`

  const result  = await model.generateContent(prompt)
  const text    = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()

  return {
    patientData: data,
    triage:      JSON.parse(cleaned),
    timestamp:   new Date().toISOString(),
  }
}