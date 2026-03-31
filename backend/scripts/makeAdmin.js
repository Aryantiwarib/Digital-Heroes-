const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const User = require("../models/User");

const makeAdmin = async () => {
  const emailToElevate = process.argv[2];

  if (!emailToElevate) {
    console.error("Please provide the email of the user to make Admin.");
    console.log("Usage: node makeAdmin.js <user_email>");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const user = await User.findOneAndUpdate(
      { email: emailToElevate },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`Success! ${user.email} is now an ADMIN.`);
    } else {
      console.log(`User with email ${emailToElevate} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error);
    process.exit(1);
  }
};

makeAdmin();
