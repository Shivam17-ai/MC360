const express = require("express");
const router = express.Router();
const testController = require("../controllers/test.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/", authorize("doctor", "hospital"), testController.orderTest);
router.get("/", authorize("patient"), testController.getMyTests);
router.get("/:id", testController.getTestById);
router.put("/:id/status", authorize("hospital", "admin"), testController.updateTestStatus);
router.post("/:id/collect-sample", authorize("hospital"), testController.collectSample);

module.exports = router;