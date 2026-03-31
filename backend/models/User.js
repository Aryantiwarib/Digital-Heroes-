const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  subscriptionStatus: { type: String, enum: ["inactive", "active", "expired"], default: "inactive" },
  charityId: { type: mongoose.Schema.Types.ObjectId, ref: "Charity" },
  contributionPercentage: { type: Number, default: 10, min: 10, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
