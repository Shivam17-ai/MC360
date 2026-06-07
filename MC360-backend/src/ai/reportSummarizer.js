exports.summarizeReport = (report) => ({ summary: report });
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

/**
 * Summarize a medical report using Gemini Vision
 * @param {string} filePath  - path to uploaded report (PDF/image)
 * @param {string} mimeType  - 'image/jpeg' | 'image/png' | 'application/pdf'
 * @param {object} patient   - { name, age, gender }
 */
export const summarizeReport = async (filePath, mimeType, patient = {}) => {
  const fileData   = fs.readFileSync(filePath)
  const base64Data = fileData.toString('base64')

  const prompt = `
You are an expert medical report analyst.

Patient: ${patient.name || 'Unknown'}, Age: ${patient.age || 'Unknown'}, Gender: ${patient.gender || 'Unknown'}

Analyze this medical report and respond ONLY in this exact JSON:
{
  "reportType": "type of report",
  "summary": "plain English summary (2-3 sentences)",
  "keyFindings": ["finding 1", "finding 2"],
  "abnormalValues": [
    { "parameter": "name", "value": "value", "normalRange": "range", "interpretation": "what it means" }
  ],
  "normalValues": ["parameter1", "parameter2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "urgency": "Routine" | "Follow-up Needed" | "Urgent",
  "disclaimer": "short disclaimer"
}
`

  const result  = await model.generateContent([
    prompt,
    { inlineData: { mimeType, data: base64Data } },
  ])

  const text    = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()

  return {
    patient,
    summary:   JSON.parse(cleaned),
    timestamp: new Date().toISOString(),
  }
}