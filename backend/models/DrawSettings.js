const mongoose = require("mongoose");

const DrawSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  jackpotRollover: { type: Number, default: 0 }
});

module.exports = mongoose.model("DrawSettings", DrawSettingsSchema);
