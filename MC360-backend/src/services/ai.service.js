const axios = require("axios");
const logger = require("../utils/logger");
const env = require("../config/env");

/**
 * ai.service.js
 * Uses Groq (Llama 3) for high-performance AI inference.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

const callGroq = async (messages, options = {}) => {
  let apiKey = (process.env.GROQ_API_KEY || env.GROQ_API_KEY || "").trim();

  if (!apiKey) {
    throw Object.assign(
      new Error("AI service not configured. Please add GROQ_API_KEY to your .env file."),
      { statusCode: 503 }
    );
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: options.model || DEFAULT_MODEL,
        messages: Array.isArray(messages) ? messages : [{ role: "user", content: messages }],
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens || 2048,
        response_format: options.json ? { type: "json_object" } : undefined,
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq");
    return content;
  } catch (err) {
    if (err.response?.status === 429) {
      throw Object.assign(new Error("Rate limit reached. Please try again later."), { statusCode: 429 });
    }
    logger.error(`Groq API error: ${err.response?.data?.error?.message || err.message}`);
    throw Object.assign(new Error("AI service temporarily unavailable."), { statusCode: 503 });
  }
};

const parseJSON = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0].trim());
  } catch (err) {
    logger.error(`JSON Parse Error: ${err.message}`);
    throw err;
  }
};

// ── Symptom Analysis ──────────────────────────────────────────────────────────
const analyzeSymptoms = async (symptoms, patientInfo = {}) => {
  const systemPrompt = `You are a world-class medical AI assistant. Analyze the patient symptoms and return a comprehensive triage assessment in JSON format.
  IMPORTANT: Never give a definitive diagnosis. Always include a disclaimer. Provide practical home remedies and medicines to avoid.`;

  const userPrompt = `Patient Profile: Age ${patientInfo.age || "unknown"}, Gender ${patientInfo.gender || "unknown"}
  Symptoms: ${JSON.stringify(symptoms)}
  Additional Info: ${JSON.stringify(patientInfo.additionalInfo || {})}

  Return a JSON object with this exact schema:
  {
    "summary": "detailed plain-English overview",
    "riskLevel": "high/moderate/low",
    "possibleConditions": [{"name": "string", "probability": "string", "description": "string"}],
    "recommendations": ["string"],
    "remedies": ["Specific home remedy"],
    "medicinesToAvoid": ["Specific OTC medicine"],
    "disclaimer": "Standard disclaimer"
  }`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
    const raw = await callGroq(messages, { json: true });
    return parseJSON(raw);
  } catch (err) {
    logger.error(`Symptom analysis error: ${err.message}`);
    return {
      possibleConditions: [],
      riskLevel: "moderate",
      summary: "AI analysis unavailable at this moment. Please see a healthcare professional.",
      recommendations: ["Please consult a doctor."],
      remedies: [],
      medicinesToAvoid: [],
      disclaimer: "AI analysis unavailable.",
    };
  }
};

// ── Report Summarizer ─────────────────────────────────────────────────────────
const summarizeReport = async (reportText, reportType = "lab-report") => {
  const systemPrompt = `You are a medical AI assistant. Summarize the following ${reportType} in simple, patient-friendly language in JSON format.`;
  
  const userPrompt = `Report Content: ${reportText.substring(0, 5000)}
  Return this exact JSON structure:
  {
    "summary": "plain-English summary",
    "keyFindings": ["finding"],
    "abnormalValues": [{"parameter": "string", "value": "string", "normal": "string", "concern": "string"}],
    "recommendations": ["string"],
    "urgency": "routine/follow-up-needed/urgent",
    "disclaimer": "string"
  }`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
    const raw = await callGroq(messages, { json: true });
    return parseJSON(raw);
  } catch (err) {
    logger.error(`Report summary error: ${err.message}`);
    return {
      summary: "Unable to summarize. Please consult your doctor.",
      recommendations: ["Consult your doctor to review this report."],
      disclaimer: "AI analysis unavailable.",
    };
  }
};

// ── Diet Plan Generator ───────────────────────────────────────────────────────
const generateDietPlan = async (patientData) => {
  const systemPrompt = `You are a clinical nutritionist AI specializing in Indian cuisine. Generate a highly personalized 7-day Indian diet plan in JSON format.
  Focus on local ingredients like Dal, Poha, Roti, Sabzi, Idli, etc., based on the user's diet type.`;
  
  const userPrompt = `Patient Profile: Age ${patientData.age || 'unknown'}, Goal: ${patientData.goal}, Diet Type: ${patientData.dietType}, Allergies: ${patientData.allergies || 'none'}, Calories: ${patientData.targetCalories} kcal.
  
  Return this exact JSON structure:
  {
    "title": "7-Day Indian Meal Plan",
    "totalCalories": ${patientData.targetCalories},
    "days": [
      {
        "totalCalories": 1800,
        "breakfast": { "name": "e.g. Masala Poha", "description": "1 bowl with peanuts and lemon", "calories": 350 },
        "lunch": { "name": "e.g. Dal Tadka & Bhindi Sabzi", "description": "2 phulkas with 1 bowl dal", "calories": 550 },
        "snack": { "name": "e.g. Roasted Makhana", "description": "Handful with green tea", "calories": 150 },
        "dinner": { "name": "e.g. Khichdi", "description": "1 bowl with curd", "calories": 450 }
      }
    ]
  }
  Ensure there are exactly 7 days in the "days" array. Respond ONLY with valid JSON.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
    const raw = await callGroq(messages, { json: true });
    return parseJSON(raw);
  } catch (err) {
    logger.error(`Diet generation error: ${err.message}`);
    throw new Error("Unable to generate diet plan. Please try again.");
  }
};

// ── Drug Interaction Checker ──────────────────────────────────────────────────
const checkDrugInteractions = async (drugs) => {
  const systemPrompt = `You are a clinical pharmacist AI. Check for drug interactions in JSON format.`;
  const userPrompt = `Drugs: ${drugs.join(", ")}
  Return JSON: {"hasInteractions": boolean, "interactions": [{"drug1": "string", "drug2": "string", "severity": "string", "description": "string"}]}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
    const raw = await callGroq(messages, { json: true });
    return parseJSON(raw);
  } catch (err) {
    logger.error(`Drug interaction error: ${err.message}`);
    return { hasInteractions: false, interactions: [], disclaimer: "Unable to check interactions." };
  }
};

// ── AI Chatbot ───────────────────────────────────────────────────────────────
const chatWithAI = async (messages, patientInfo = {}) => {
  const systemPrompt = `You are MC360 AI, an empathetic medical assistant. Current Patient: Age ${patientInfo.age || 'unknown'}, Gender ${patientInfo.gender || 'unknown'}. 
  NEVER diagnose. If serious, recommend emergency services. Keep responses concise and use markdown.`;

  try {
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];
    return await callGroq(groqMessages);
  } catch (err) {
    logger.error(`AI Chat error: ${err.message}`);
    throw err;
  }
};

module.exports = {
  analyzeSymptoms,
  summarizeReport,
  generateDietPlan,
  checkDrugInteractions,
  chatWithAI,
};