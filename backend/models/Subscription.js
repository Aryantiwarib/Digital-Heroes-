const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["monthly", "yearly"], required: true },
  status: { type: String, enum: ["active", "inactive", "expired", "pending"], default: "inactive" },
  startDate: { type: Date },
  endDate: { type: Date },
  razorpayOrderId: { type: String },
  razorpaySubscriptionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
