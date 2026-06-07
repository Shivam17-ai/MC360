// ── Basic drug interaction database ──────────────────────────────────────
const INTERACTIONS = {
  warfarin:    ["aspirin", "ibuprofen", "naproxen", "clopidogrel", "fluconazole"],
  metformin:   ["alcohol", "contrast dye", "cimetidine"],
  aspirin:     ["warfarin", "ibuprofen", "clopidogrel", "naproxen"],
  lisinopril:  ["potassium", "spironolactone", "nsaids", "ibuprofen"],
  atorvastatin:["clarithromycin", "erythromycin", "cyclosporine", "gemfibrozil"],
  amlodipine:  ["simvastatin", "clarithromycin", "grapefruit"],
  metoprolol:  ["verapamil", "diltiazem", "clonidine", "amiodarone"],
  ciprofloxacin:["antacids", "warfarin", "theophylline", "tizanidine"],
  omeprazole:  ["clopidogrel", "methotrexate", "digoxin"],
  amoxicillin: ["warfarin", "methotrexate", "oral contraceptives"],
};

const SEVERITY = {
  warfarin_aspirin:        { severity: "High",   effect: "Increased bleeding risk" },
  warfarin_ibuprofen:      { severity: "High",   effect: "Increased bleeding risk" },
  metformin_alcohol:       { severity: "Moderate", effect: "Risk of lactic acidosis" },
  lisinopril_potassium:    { severity: "Moderate", effect: "Risk of hyperkalemia" },
  atorvastatin_clarithromycin: { severity: "High", effect: "Increased risk of muscle damage (rhabdomyolysis)" },
  amlodipine_simvastatin:  { severity: "Moderate", effect: "Increased simvastatin levels" },
  ciprofloxacin_warfarin:  { severity: "High",   effect: "Increased anticoagulant effect" },
  omeprazole_clopidogrel:  { severity: "Moderate", effect: "Reduced clopidogrel effectiveness" },
};

/**
 * Check interactions between a list of medicines
 * @param {string[]} medicines - list of medicine names
 */
export const checkDrugInteractions = (medicines) => {
  const lowerMeds = medicines.map((m) => m.toLowerCase().trim());
  const interactions = [];

  for (let i = 0; i < lowerMeds.length; i++) {
    for (let j = i + 1; j < lowerMeds.length; j++) {
      const a = lowerMeds[i];
      const b = lowerMeds[j];

      const aInteracts = INTERACTIONS[a] || [];
      const bInteracts = INTERACTIONS[b] || [];

      if (aInteracts.includes(b) || bInteracts.includes(a)) {
        const key1 = `${a}_${b}`;
        const key2 = `${b}_${a}`;
        const detail = SEVERITY[key1] || SEVERITY[key2] || {
          severity: "Moderate",
          effect: "Potential interaction — consult your doctor",
        };

        interactions.push({
          drug1: medicines[i],
          drug2: medicines[j],
          severity: detail.severity,
          effect: detail.effect,
          recommendation: "Consult your doctor or pharmacist before taking these together",
        });
      }
    }
  }

  return {
    checked: medicines,
    totalInteractions: interactions.length,
    interactions,
    safe: interactions.length === 0,
  };
};