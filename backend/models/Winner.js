const mongoose = require("mongoose");

const WinnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: "Draw", required: true },
  matchType: { type: Number, enum: [3, 4, 5], required: true },
  proofImage: { type: String }, // path to the uploaded image or Base64
  status: { type: String, enum: ["pending", "approved", "rejected", "paid"], default: "pending" },
  prizeAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Winner", WinnerSchema);
