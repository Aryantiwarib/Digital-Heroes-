const express = require("express");
const { addScore, getScores, getAllScores, updateScore } = require("../controllers/scoreController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, addScore);
router.get("/", protect, getScores);

// Admin routes
router.get("/all", protect, authorize("admin"), getAllScores);
router.put("/:id", protect, authorize("admin"), updateScore);

module.exports = router;
