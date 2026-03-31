const Score = require("../models/Score");

exports.addScore = async (req, res) => {
  const { score, date } = req.body;

  if (score < 1 || score > 45) {
    return res.status(400).json({ success: false, message: "Score must be between 1 and 45" });
  }

  if (!date) {
    return res.status(400).json({ success: false, message: "Date is explicitly required" });
  }

  try {
    // Save new score
    const newScore = await Score.create({
      userId: req.user._id,
      score,
      date: date,
    });

    // Enforce 5 scores logic
    const userScores = await Score.find({ userId: req.user._id }).sort({ date: 1 });
    
    if (userScores.length > 5) {
      // Remove oldest (which is at the beginning of the sorted array)
      const scoresToRemove = userScores.slice(0, userScores.length - 5);
      for (let s of scoresToRemove) {
        await Score.findByIdAndDelete(s._id);
      }
    }

    res.status(201).json({ success: true, message: "Score added successfully", score: newScore });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getScores = async (req, res) => {
  try {
    // Latest first
    const scores = await Score.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getAllScores = async (req, res) => {
  try {
    const scores = await Score.find().populate('userId', 'name email').sort({ date: -1 });
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, date } = req.body;
    if (score && (score < 1 || score > 45)) {
      return res.status(400).json({ success: false, message: "Score must be between 1 and 45" });
    }
    const updatedScore = await Score.findByIdAndUpdate(id, { score, date }, { new: true });
    if (!updatedScore) return res.status(404).json({ success: false, message: "Score not found" });
    
    res.json({ success: true, score: updatedScore });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
