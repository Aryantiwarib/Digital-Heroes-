const Winner = require("../models/Winner");
// Optional: If you want to use multer for file uploads
const multer = require("multer");
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.uploadProofOptions = multer({ storage });

exports.uploadProof = async (req, res) => {
  const { drawId, matchType, prizeAmount } = req.body;
  const proofImage = req.file ? req.file.path : "";

  try {
    const winner = await Winner.create({
      userId: req.user._id,
      drawId,
      matchType,
      proofImage,
      prizeAmount,
      status: "pending",
    });

    res.status(201).json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.verifyWinner = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // approved, rejected, paid

  try {
    const winner = await Winner.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getWinners = async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate("userId", "name email")
      .populate("drawId", "drawDate type");
    res.json({ success: true, winners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getMyWinnings = async (req, res) => {
  try {
    const Draw = require("../models/Draw");
    // Find draws where this user has a matchCount >= 3
    const draws = await Draw.find({ 
      "results.userId": req.user._id, 
      "results.matchCount": { $gte: 3 },
      "status": "published"
    }).sort({ drawDate: -1 });

    const winnings = [];

    for (let d of draws) {
      const resultObj = d.results.find(r => r.userId.toString() === req.user._id.toString());
      if (resultObj) {
        // Check if proof already submitted
        const proofRecord = await Winner.findOne({ userId: req.user._id, drawId: d._id });
        
        winnings.push({
          drawId: d._id,
          date: d.drawDate,
          type: d.type,
          matchCount: resultObj.matchCount,
          prizeShare: resultObj.prizeShare,
          proofStatus: proofRecord ? proofRecord.status : "missing",
          proofImage: proofRecord ? proofRecord.proofImage : null,
          winnerRecordId: proofRecord ? proofRecord._id : null
        });
      }
    }

    res.json({ success: true, winnings });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
