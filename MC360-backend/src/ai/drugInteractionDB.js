import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

/**
 * Check drug interactions using Gemini
 * @param {string[]} drugs - list of drug names
 * @param {object}   patient - { age, conditions, allergies }
 */
export const checkDrugInteractions = async (drugs, patient = {}) => {
  if (!drugs || drugs.length < 2) {
    return { error: 'At least 2 drugs are required to check interactions' }
  }

  const prompt = `
You are a clinical pharmacist AI.

Patient:
- Age: ${patient.age || 'Unknown'}
- Conditions: ${patient.conditions?.join(', ') || 'None'}
- Known Allergies: ${patient.allergies?.join(', ') || 'None'}

Drugs to check: ${drugs.join(', ')}

Check for interactions and respond ONLY in this exact JSON:
{
  "drugs": ["drug1", "drug2"],
  "interactions": [
    {
      "drug1": "name",
      "drug2": "name",
      "severity": "Major" | "Moderate" | "Minor" | "None",
      "effect": "what happens when combined",
      "mechanism": "why it happens",
      "recommendation": "what to do"
    }
  ],
  "overallRisk": "Safe" | "Caution" | "Avoid",
  "summary": "plain English summary",
  "disclaimer": "short disclaimer"
}

If no interactions exist, return an empty interactions array with overallRisk: "Safe".
`

  const result  = await model.generateContent(prompt)
  const text    = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()

  return {
    checkedDrugs: drugs,
    patient,
    result:       JSON.parse(cleaned),
    timestamp:    new Date().toISOString(),
  }
}