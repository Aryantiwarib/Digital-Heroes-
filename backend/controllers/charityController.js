const Charity = require("../models/Charity");

exports.getCharities = async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json({ success: true, charities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.addCharity = async (req, res) => {
  const { name, description, image } = req.body;
  
  try {
    const charity = await Charity.create({ name, description, image });
    res.status(201).json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateCharity = async (req, res) => {
  const { id } = req.params;
  try {
    const charity = await Charity.findByIdAndUpdate(id, req.body, { new: true });
    if (!charity) return res.status(404).json({ success: false, message: "Charity not found" });
    res.json({ success: true, charity });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

exports.deleteCharity = async (req, res) => {
  const { id } = req.params;
  try {
    await Charity.findByIdAndDelete(id);
    res.json({ success: true, message: "Charity deleted" });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
