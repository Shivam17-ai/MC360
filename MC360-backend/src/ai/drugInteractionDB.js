const { checkDrugInteractions } = require("../services/ai.service");
const logger = require("../utils/logger");

/**
 * drugInteractionDB.js
 * Drug interaction checker with a built-in local reference database
 * for instant common interactions, plus AI fallback for unknown combinations.
 */

/**
 * Local reference database of well-known dangerous drug interactions.
 * Format: key = sorted drug pair joined by "|", value = interaction info.
 */
const LOCAL_INTERACTION_DB = {
  "aspirin|warfarin": {
    severity: "severe",
    description: "Aspirin and Warfarin together significantly increase bleeding risk.",
    clinicalEffect: "Increased anticoagulation effect and risk of haemorrhage.",
    recommendation: "Avoid combination. If necessary, use with extreme caution under medical supervision.",
  },
  "metformin|alcohol": {
    severity: "moderate",
    description: "Metformin combined with alcohol increases the risk of lactic acidosis.",
    clinicalEffect: "Elevated lactic acid levels, potentially fatal.",
    recommendation: "Avoid or limit alcohol consumption while taking Metformin.",
  },
  "ibuprofen|warfarin": {
    severity: "severe",
    description: "NSAIDs like Ibuprofen enhance the anticoagulant effect of Warfarin.",
    clinicalEffect: "Risk of serious bleeding including GI haemorrhage.",
    recommendation: "Avoid combination. Use paracetamol for pain relief instead.",
  },
  "ciprofloxacin|antacids": {
    severity: "moderate",
    description: "Antacids containing aluminium/magnesium reduce Ciprofloxacin absorption.",
    clinicalEffect: "Reduced antibiotic effectiveness.",
    recommendation: "Take Ciprofloxacin 2 hours before or 6 hours after antacids.",
  },
  "simvastatin|clarithromycin": {
    severity: "severe",
    description: "Clarithromycin inhibits metabolism of Simvastatin, greatly increasing blood levels.",
    clinicalEffect: "High risk of myopathy and rhabdomyolysis.",
    recommendation: "Avoid combination. Suspend statin therapy during antibiotic course.",
  },
  "ssri|maoi": {
    severity: "contraindicated",
    description: "SSRIs and MAOIs together can cause serotonin syndrome.",
    clinicalEffect: "Life-threatening serotonin syndrome: hyperthermia, seizures, death.",
    recommendation: "NEVER combine. Wait 14 days after stopping MAOI before starting SSRI.",
  },
  "amlodipine|simvastatin": {
    severity: "moderate",
    description: "Amlodipine can increase Simvastatin blood levels.",
    clinicalEffect: "Increased risk of myopathy.",
    recommendation: "Limit Simvastatin dose to 20mg daily. Monitor for muscle pain.",
  },
  "lithium|ibuprofen": {
    severity: "severe",
    description: "NSAIDs reduce Lithium excretion, causing toxicity.",
    clinicalEffect: "Lithium toxicity: tremor, nausea, confusion, cardiac arrhythmia.",
    recommendation: "Avoid NSAIDs. Use paracetamol instead. Monitor Lithium levels.",
  },
  "digoxin|amiodarone": {
    severity: "severe",
    description: "Amiodarone increases Digoxin plasma levels.",
    clinicalEffect: "Digoxin toxicity: nausea, arrhythmias, visual disturbances.",
    recommendation: "Reduce Digoxin dose by 50% and monitor levels closely.",
  },
  "methotrexate|nsaids": {
    severity: "severe",
    description: "NSAIDs reduce Methotrexate excretion.",
    clinicalEffect: "Methotrexate toxicity: bone marrow suppression, hepatotoxicity.",
    recommendation: "Avoid NSAIDs during Methotrexate therapy.",
  },
};

/**
 * Normalise a drug name for lookup (lowercase, remove spaces/special chars).
 */
const normalizeDrug = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

/**
 * Generate all unique pairs from an array of drug names.
 */
const generatePairs = (drugs) => {
  const pairs = [];
  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      pairs.push([drugs[i], drugs[j]]);
    }
  }
  return pairs;
};

/**
 * Look up a drug pair in the local database.
 * Returns interaction info or null.
 */
const checkLocalDB = (drug1, drug2) => {
  const key1 = [normalizeDrug(drug1), normalizeDrug(drug2)].sort().join("|");

  // Direct match
  if (LOCAL_INTERACTION_DB[key1]) {
    return { ...LOCAL_INTERACTION_DB[key1], drug1, drug2, source: "local-db" };
  }

  // Partial match (e.g. "ssri" matches "sertraline", "fluoxetine")
  const ssriDrugs = ["sertraline", "fluoxetine", "paroxetine", "escitalopram", "citalopram", "fluvoxamine"];
  const maoiDrugs = ["phenelzine", "tranylcypromine", "selegiline", "isocarboxazid", "moclobemide"];
  const nsaidDrugs = ["ibuprofen", "naproxen", "diclofenac", "celecoxib", "indomethacin", "mefenamic"];

  const d1n = normalizeDrug(drug1);
  const d2n = normalizeDrug(drug2);

  const isSSRI = (d) => ssriDrugs.includes(d);
  const isMAOI = (d) => maoiDrugs.includes(d);
  const isNSAID = (d) => nsaidDrugs.includes(d);

  if ((isSSRI(d1n) && isMAOI(d2n)) || (isSSRI(d2n) && isMAOI(d1n))) {
    return { ...LOCAL_INTERACTION_DB["ssri|maoi"], drug1, drug2, source: "local-db" };
  }
  if ((isNSAID(d1n) && d2n === "warfarin") || (isNSAID(d2n) && d1n === "warfarin")) {
    return { ...LOCAL_INTERACTION_DB["ibuprofen|warfarin"], drug1, drug2, source: "local-db" };
  }
  if ((isNSAID(d1n) && d2n === "methotrexate") || (isNSAID(d2n) && d1n === "methotrexate")) {
    return { ...LOCAL_INTERACTION_DB["methotrexate|nsaids"], drug1, drug2, source: "local-db" };
  }

  return null;
};

/**
 * Full interaction check:
 * 1. Check local DB for instant results.
 * 2. Send all drugs to AI for comprehensive analysis.
 * 3. Merge results (local DB results take priority).
 *
 * @param {string[]} drugs - Array of drug names
 * @returns {Object} interaction result
 */
const checkInteractions = async (drugs) => {
  if (!drugs || drugs.length < 2) {
    return { hasInteractions: false, interactions: [], safeToTakeTogether: true, disclaimer: "At least 2 drugs are required to check interactions." };
  }

  const pairs = generatePairs(drugs);
  const localResults = [];

  for (const [d1, d2] of pairs) {
    const interaction = checkLocalDB(d1, d2);
    if (interaction) localResults.push(interaction);
  }

  // Also run AI check for comprehensive coverage
  let aiResult = { hasInteractions: false, interactions: [], safeToTakeTogether: true };
  try {
    aiResult = await checkDrugInteractions(drugs);
  } catch (err) {
    logger.warn(`AI drug interaction check failed: ${err.message}`);
  }

  // Merge: local DB results have higher confidence
  const localDrugPairs = new Set(localResults.map((r) => [normalizeDrug(r.drug1), normalizeDrug(r.drug2)].sort().join("|")));
  const aiInteractions = (aiResult.interactions || []).filter((i) => {
    const key = [normalizeDrug(i.drug1 || ""), normalizeDrug(i.drug2 || "")].sort().join("|");
    return !localDrugPairs.has(key);
  });

  const allInteractions = [...localResults, ...aiInteractions];
  const hasInteractions = allInteractions.length > 0;
  const hasSevere = allInteractions.some((i) => ["severe", "contraindicated"].includes(i.severity));

  return {
    hasInteractions,
    interactions: allInteractions,
    safeToTakeTogether: !hasSevere,
    hasSevereInteraction: hasSevere,
    totalDrugsChecked: drugs.length,
    disclaimer: "This check is for reference only. Always consult your pharmacist or doctor before taking multiple medications.",
  };
};

/**
 * Get severity level colour for UI display.
 */
const getSeverityColor = (severity) => {
  const colors = { mild: "green", moderate: "yellow", severe: "orange", contraindicated: "red" };
  return colors[severity] || "gray";
};

module.exports = {
  checkInteractions,
  checkLocalDB,
  generatePairs,
  normalizeDrug,
  getSeverityColor,
  LOCAL_INTERACTION_DB,
};