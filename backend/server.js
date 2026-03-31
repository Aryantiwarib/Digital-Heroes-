require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const Charity = require("./models/Charity"); // Needed for seeding
const User = require("./models/User");

// Routes
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");
const charityRoutes = require("./routes/charity");
const paymentRoutes = require("./routes/payment");
const drawRoutes = require("./routes/draw");
const winnerRoutes = require("./routes/winner");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For proof images if local

// Database Connection
connectDB().then(async () => {
  // Auto-seed admin user
  const adminExists = await User.findOne({ email: "admin@digitalheroes.com" });
  if (!adminExists) {
    console.log("Seeding default Admin Account...");
    await User.create({
      name: "Super Admin",
      email: "admin@digitalheroes.com",
      password: "admin123", // Automatically hashed by the Schema
      role: "admin",
      subscriptionStatus: "active"
    });
    console.log("Admin seeded. Login: admin@digitalheroes.com / admin123");
  }

  // Auto-seed charities if empty
  const count = await Charity.countDocuments();
  if (count === 0) {
    console.log("Seeding initial charities...");
    await Charity.insertMany([
      { name: "Global Golf Foundation", description: "Supporting junior golf development globally.", image: "https://images.unsplash.com/photo-1535136125437-010534c062c3?auto=format&fit=crop&w=400&q=80" },
      { name: "Fairway Kids", description: "Providing golf equipment to underprivileged youth.", image: "https://images.unsplash.com/photo-1593111774240-d529f12eb606?auto=format&fit=crop&w=400&q=80" },
      { name: "Green Impact", description: "Golf courses dedicated to environmental conservation.", image: "https://images.unsplash.com/photo-1593111774301-49666cde9db0?auto=format&fit=crop&w=400&q=80" }
    ]);
    console.log("Charities seeded.");
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/winner", winnerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ success: false, message: "Server Error", error: err.message });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Golf Charity API");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
