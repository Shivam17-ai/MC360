const DrugInteraction = require("../models/DrugInteraction.model");
const { checkDrugInteractions } = require("./ai.service");

const checkInteractions = async (drugs, patientId, checkedBy) => {
  if (!drugs || drugs.length < 2) {
    throw Object.assign(new Error("At least 2 drugs required to check interactions."), { statusCode: 400 });
  }

  const result = await checkDrugInteractions(drugs);

  const record = await DrugInteraction.create({
    patient: patientId,
    drugs,
    interactions: result.interactions || [],
    hasInteractions: result.hasInteractions,
    checkedBy,
  });

  return { ...result, _id: record._id };
};

module.exports = { checkInteractions };