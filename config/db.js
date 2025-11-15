const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    // Modern connection (no deprecated options)
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
