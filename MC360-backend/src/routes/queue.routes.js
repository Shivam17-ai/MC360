const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queue.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.post("/token", authorize("patient"), queueController.generateToken);
router.get("/my-token", authorize("patient"), queueController.getMyToken);
router.get("/status", queueController.getQueueStatus);
router.post("/call-next", authorize("doctor"), queueController.callNext);
router.put("/:id/status", authorize("doctor", "hospital"), queueController.updateTokenStatus);

module.exports = router;