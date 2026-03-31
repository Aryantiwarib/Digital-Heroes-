const User = require("../models/User");
const Subscription = require("../models/Subscription");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.register = async (req, res) => {
  const { name, email, password, charityId, contributionPercentage } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      charityId,
      contributionPercentage: contributionPercentage || 10,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.subscriptionStatus },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error occurred while registering user:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.subscriptionStatus },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('charityId', 'name image');
    const subscription = await Subscription.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.json({ success: true, user, subscription });
  } catch(error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

// For Admin to get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.subscriptionStatus = req.body.subscriptionStatus || user.subscriptionStatus;
    await user.save();
    
    // Deactivate subscriptions if admin marks status as expired
    if (req.body.subscriptionStatus === "expired") {
      await Subscription.updateMany({ userId: user._id, status: "active" }, { status: "expired" });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
