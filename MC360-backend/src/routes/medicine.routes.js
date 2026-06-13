const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicine.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/", authorize("patient"), medicineController.addMedicine);
router.get("/", authorize("patient"), medicineController.getMyMedicines);
router.get("/adherence", authorize("patient"), medicineController.getAdherenceStats);
router.post("/check-interactions", medicineController.checkDrugInteractions);
router.get("/:id", medicineController.getMedicineById);
router.put("/:id", authorize("patient"), medicineController.updateMedicine);
router.delete("/:id", authorize("patient"), medicineController.deleteMedicine);
router.post("/:id/adherence", authorize("patient"), medicineController.logAdherence);

module.exports = router;