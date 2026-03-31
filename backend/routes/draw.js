const express = require("express");
const { runDraw, getDrawResults, publishDraw } = require("../controllers/drawController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/run", protect, authorize("admin"), runDraw);
router.get("/results", protect, getDrawResults);
router.post("/publish/:id", protect, authorize("admin"), publishDraw);

module.exports = router;
