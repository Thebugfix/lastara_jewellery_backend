const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Newsletter", newsletterSchema);
