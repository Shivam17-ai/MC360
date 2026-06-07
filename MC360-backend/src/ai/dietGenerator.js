exports.generateDiet = (profile) => ({ profile });
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

/**
 * Generate personalized diet plan using Gemini
 * @param {object} patient - health profile
 */
export const generateDietPlan = async (patient) => {
  const prompt = `
You are a certified clinical nutritionist AI.

Patient Profile:
- Name: ${patient.name}
- Age: ${patient.age}
- Gender: ${patient.gender}
- Weight: ${patient.weight} kg
- Height: ${patient.height} cm
- Conditions: ${patient.conditions?.join(', ') || 'None'}
- Allergies: ${patient.allergies?.join(', ') || 'None'}
- Goal: ${patient.goal || 'Maintain healthy weight'}
- Activity Level: ${patient.activityLevel || 'Moderate'}
- Food Preference: ${patient.preference || 'Vegetarian'}
- Country/Region: ${patient.region || 'India'}

Generate a practical 1-day Indian diet plan and respond ONLY in this exact JSON:
{
  "totalCalories": number,
  "macros": {
    "protein": "Xg",
    "carbs": "Xg",
    "fats": "Xg",
    "fiber": "Xg"
  },
  "meals": {
    "earlyMorning": { "time": "6:30 AM", "items": ["item1"], "calories": number },
    "breakfast":    { "time": "8:00 AM", "items": ["item1"], "calories": number },
    "midMorning":   { "time": "11:00 AM","items": ["item1"], "calories": number },
    "lunch":        { "time": "1:00 PM", "items": ["item1"], "calories": number },
    "evening":      { "time": "4:30 PM", "items": ["item1"], "calories": number },
    "dinner":       { "time": "7:30 PM", "items": ["item1"], "calories": number }
  },
  "hydration": "water intake recommendation",
  "avoidFoods": ["food1", "food2"],
  "tips": ["tip1", "tip2"],
  "disclaimer": "short disclaimer"
}
`

  const result  = await model.generateContent(prompt)
  const text    = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()

  return {
    patient,
    dietPlan:  JSON.parse(cleaned),
    timestamp: new Date().toISOString(),
  }
}