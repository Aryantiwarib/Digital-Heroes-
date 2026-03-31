const express = require("express");
const { uploadProof, verifyWinner, getWinners, getMyWinnings, uploadProofOptions } = require("../controllers/winnerController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/upload", protect, uploadProofOptions.single("image"), uploadProof);
router.put("/verify/:id", protect, authorize("admin"), verifyWinner);
router.get("/my-winnings", protect, getMyWinnings);
router.get("/", protect, authorize("admin"), getWinners);

module.exports = router;
