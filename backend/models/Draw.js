const mongoose = require("mongoose");

const DrawSchema = new mongoose.Schema({
  drawDate: { type: Date, required: true },
  winningNumbers: [{ type: Number }],
  type: { type: String, enum: ["random", "algorithm"], required: true },
  status: { type: String, enum: ["simulated", "published"], default: "simulated" },
  results: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      matchCount: { type: Number },
      prizeShare: { type: Number, default: 0 }
    }
  ],
  totalPrizePool: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Draw", DrawSchema);
